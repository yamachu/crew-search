package dev.yamachu.crewsearch.objects

import dev.yamachu.crewsearch.utils._
import io.circe.Encoder
import io.circe.generic.auto._
import io.circe.syntax._

case class SearchDocumentRequestPayload(key: String, `@search.action`: SearchAction) {
  def addBody(requests: AnyRef): Map[String, String] = (ccToMap(this) ++ ccToMap(requests)).map {
    case (k, v) => k -> v.toString
  }
}

sealed trait SearchDocumentUpdateRequestTrait

// fixme: circeだとMap[String, Any]がダメなので一旦決め打ちでStringにしている
//        別のライブラリを検討してAnyの状態でも出来るようにしたい
case class SearchDocumentUpdateRequestMap(value: Seq[Map[String, String]])
    extends SearchDocumentUpdateRequestTrait
case class SearchDocumentUpdateRequest(value: Seq[SearchDocumentRequestPayload])
    extends SearchDocumentUpdateRequestTrait

object SearchDocumentUpdateRequestTrait {
  implicit val encode: Encoder[SearchDocumentUpdateRequestTrait] = Encoder.instance {
    case v @ SearchDocumentUpdateRequestMap(_) => v.asJson
    case v @ SearchDocumentUpdateRequest(_)    => v.asJson
  }
}

object SearchDocumentRequest {
  def upload[T <: AnyRef](requests: Seq[T],
                          keySelector: T => String): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequestMap(
      value = requests.map(r => SearchDocumentRequestPayload(keySelector(r), Upload).addBody(r))
    )

  def merge[T <: AnyRef](requests: Seq[T],
                         keySelector: T => String): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequestMap(
      value = requests.map(r => SearchDocumentRequestPayload(keySelector(r), Merge).addBody(r))
    )

  def mergeOrUpload[T <: AnyRef](requests: Seq[T],
                                 keySelector: T => String): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequestMap(
      value =
        requests.map(r => SearchDocumentRequestPayload(keySelector(r), MergeOrUpload).addBody(r))
    )

  def delete[T <: AnyRef](requests: Seq[T],
                          keySelector: T => String): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequest(
      value = requests.map(r => SearchDocumentRequestPayload(keySelector(r), Delete))
    )
}

sealed trait SearchAction

object SearchAction {
  implicit val encode: Encoder[SearchAction] = Encoder.instance {
    case _ @Upload        => "upload".asJson
    case _ @Merge         => "merge".asJson
    case _ @MergeOrUpload => "mergeOrUpload".asJson
    case _ @Delete        => "delete".asJson
  }
}

case object Upload extends SearchAction

case object Merge extends SearchAction

case object MergeOrUpload extends SearchAction

case object Delete extends SearchAction
