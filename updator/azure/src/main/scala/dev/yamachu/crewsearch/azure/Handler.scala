package dev.yamachu.crewsearch.azure

import java.util._

import dev.yamachu.crewsearch._
import dev.yamachu.crewsearch.azure.utils.Logger
import dev.yamachu.crewsearch.objects.Requests
import com.microsoft.azure.functions._
import com.microsoft.azure.functions.annotation._

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

    (for {
      result <- Functions(logger).run(request.getBody)
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
