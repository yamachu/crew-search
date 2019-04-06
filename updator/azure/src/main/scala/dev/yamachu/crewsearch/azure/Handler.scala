package dev.yamachu.crewsearch.azure

import com.microsoft.azure.functions._
import com.microsoft.azure.functions.annotation._
import dev.yamachu.crewsearch._
import dev.yamachu.crewsearch.azure.utils.Logger
import dev.yamachu.crewsearch.objects.Requests

import collection.JavaConverters._

class Handler {
  @FunctionName("HttpHandlerPOST")
  def runHttpPost(@HttpTrigger(
                    name = "req",
                    methods = Array(HttpMethod.POST),
                    authLevel = AuthorizationLevel.ANONYMOUS
                  ) request: HttpRequestMessage[Requests],
                  context: ExecutionContext): HttpResponseMessage = {
    val logger = Logger(context.getLogger)
    logger.info("Scala HTTP POST trigger processed a request.")
    val maybeFirebaseToken =
      request.getHeaders.asScala.get("Authorization").map(_.replace("Bearer ", ""))

    (for {
      firebaseToken <- maybeFirebaseToken.toRight(new Exception("Cannot find Authorization header"))
      // ここでFirebaseToken使ってemailアドレスのValidation
      result        <- Functions(logger).run(request.getBody)
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
