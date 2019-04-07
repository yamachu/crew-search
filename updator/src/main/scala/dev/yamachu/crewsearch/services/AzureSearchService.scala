package dev.yamachu.crewsearch.services

import dev.yamachu.crewsearch.objects.SearchDocumentUpdateRequestTrait

trait AzureSearchService {
  def updateField(key: String, body: SearchDocumentUpdateRequestTrait): Either[Throwable, Unit]
}

class MockAzureSearchService extends AzureSearchService {
  override def updateField(key: String,
                           body: SearchDocumentUpdateRequestTrait): Either[Throwable, Unit] =
    Right(())
}

object AzureSearchService {
  lazy val instance: AzureSearchService = new AzureSearchServiceImpl(_config)
  private var _config: Config           = _

  def init(config: Config): Unit = _config = config
}

case class Config(serviceName: String, index: String, apiVersion: String, apiKey: String)
