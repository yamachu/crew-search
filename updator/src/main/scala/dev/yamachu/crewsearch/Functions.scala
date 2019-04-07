package dev.yamachu.crewsearch

import dev.yamachu.crewsearch.objects._
import dev.yamachu.crewsearch.services.AzureSearchService

case class Functions(logger: utils.Logger) {
  def run(req: Requests): Either[Throwable, Response] = {
    logger.info("This is common Functions run")
    for {
      _ <- AzureSearchService.instance
        .updateField(req.email,
                     SearchDocumentRequest.mergeOrUpload[Requests](Seq(req), s => s.email))
    } yield Response()
  }

}
