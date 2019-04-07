package dev.yamachu.crewsearch.services

import com.softwaremill.sttp._
import com.softwaremill.sttp.circe.circeBodySerializer
import dev.yamachu.crewsearch.objects.SearchDocumentUpdateRequestTrait
import dev.yamachu.crewsearch.services.AzureSearchService.Config
import io.circe.syntax._

import scala.util.Try

class AzureSearchServiceImpl(val config: Config) extends AzureSearchService {
  implicit val backend: SttpBackend[Id, Nothing] = HttpURLConnectionBackend()

  override def updateField(key: String,
                           body: SearchDocumentUpdateRequestTrait): Either[Throwable, Unit] =
    for {
      res <- Try(
        sttp
          .post(
            uri"https://${config.serviceName}.search.windows.net/indexes/${config.index}/docs/index?api-version=${config.apiVersion}"
          )
          .body(body.asJson)
          .header("Content-Type", "application/json")
          .header("api-key", config.apiKey)
          .send()
      ).toEither
      result <- res.code match {
        // https://docs.microsoft.com/en-us/rest/api/searchservice/AddUpdate-or-Delete-Documents
        case 200 | 201 => Right(())
        case _         => Left(new Exception(res.toString()))
      }
    } yield result
}
