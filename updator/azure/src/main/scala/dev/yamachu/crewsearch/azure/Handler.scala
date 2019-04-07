package dev.yamachu.crewsearch.azure

import com.microsoft.azure.functions._
import com.microsoft.azure.functions.annotation._
import dev.yamachu.crewsearch._
import dev.yamachu.crewsearch.azure.utils.Logger
import dev.yamachu.crewsearch.objects.Requests
import dev.yamachu.crewsearch.services.{AzureSearchService, Config, FirebaseAuthService}

import collection.JavaConverters._

class Handler {
  @FunctionName("HttpHandlerPOST")
  def runHttpPost(@HttpTrigger(
                    name = "req",
                    methods = Array(HttpMethod.POST),
                    authLevel = AuthorizationLevel.FUNCTION,
                  ) request: HttpRequestMessage[Requests],
                  context: ExecutionContext): HttpResponseMessage = {
    val logger = Logger(context.getLogger)
    logger.info("Scala HTTP POST trigger processed a request.")

    val azureSearchServiceConfig = Config(
      serviceName = sys.env.getOrElse("SEARCH_SERVICE_NAME", ""),
      index = sys.env.getOrElse("SEARCH_INDEX", ""),
      apiVersion = sys.env.getOrElse("SEARCH_API_VERSION", ""),
      apiKey = sys.env.getOrElse("SEARCH_API_KEY", ""),
    )

    AzureSearchService.init(azureSearchServiceConfig)

    val maybeFirebaseToken =
      request.getHeaders.asScala.get("authorization").map(_.replace("Bearer ", ""))
    val body = request.getBody

    (for {
      firebaseToken <- maybeFirebaseToken.toRight(new Exception("Cannot find Authorization header"))
      _ <- FirebaseAuthService.instance
        .verifyEmail(firebaseToken, body.email)
        .flatMap(
          if (_) Right(())
          else Left(new Exception("request email do not match firebase user"))
        )
      result <- Functions(logger).run(body)
    } yield result) match {
      case Right(s) =>
        request.createResponseBuilder(HttpStatus.OK).body(s).build
      case Left(e) =>
        request
          .createResponseBuilder(HttpStatus.BAD_REQUEST)
          .body(e.toString)
          .build
    }
  }
}
