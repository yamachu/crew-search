package dev.yamachu.crewsearch.objects

import dev.yamachu.crewsearch.utils._
import io.circe.{Encoder, Json, KeyEncoder}
import io.circe.generic.auto._
import io.circe.syntax._

case class SearchDocumentRequestPayload(__indexKey: IndexKey, `@search.action`: SearchAction) {
  def addBody(requests: AnyRef): Map[String, String] = (ccToMap(this) ++ ccToMap(requests)).map {
    case (_, v) if v.isInstanceOf[SearchAction] => "@search.action" -> v.toString
    case (k, _) if k == "__indexKey"            => __indexKey.key   -> __indexKey.value.toString
    case (k, v)                                 => k                -> v.toString
  }

}

object SearchDocumentRequestPayload {
  implicit val encoder: Encoder[SearchDocumentRequestPayload] = (a: SearchDocumentRequestPayload) =>
    Json.obj(
      (a.__indexKey.key, Json.fromString(a.__indexKey.value.toString)),
      ("@search.action", Json.fromString(a.`@search.action`.toString))
  )
}

case class IndexKey(key: String, value: String)

object IndexKey {
  implicit val keyEncoder: KeyEncoder[IndexKey] = (ik: IndexKey) => ik.key
  implicit val encoder: Encoder[IndexKey]       = (ik: IndexKey) => ik.value.asJson
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
                          keySelector: T => IndexKey): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequestMap(
      value = requests.map(r => SearchDocumentRequestPayload(keySelector(r), Upload).addBody(r))
    )

  def merge[T <: AnyRef](requests: Seq[T],
                         keySelector: T => IndexKey): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequestMap(
      value = requests.map(r => SearchDocumentRequestPayload(keySelector(r), Merge).addBody(r))
    )

  def mergeOrUpload[T <: AnyRef](requests: Seq[T],
                                 keySelector: T => IndexKey): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequestMap(
      value =
        requests.map(r => SearchDocumentRequestPayload(keySelector(r), MergeOrUpload).addBody(r))
    )

  def delete[T <: AnyRef](requests: Seq[T],
                          keySelector: T => IndexKey): SearchDocumentUpdateRequestTrait =
    SearchDocumentUpdateRequest(
      value = requests.map(r => SearchDocumentRequestPayload(keySelector(r), Delete))
    )
}

sealed trait SearchAction {
  override def toString: String = this match {
    case Upload        => "upload"
    case Merge         => "merge"
    case MergeOrUpload => "mergeOrUpload"
    case Delete        => "delete"
  }
}

object SearchAction {
  implicit val encode: Encoder[SearchAction] = Encoder.instance {
    case _ @Upload        => "upload".asJson
    case _ @Merge         => "merge".asJson
    case _ @MergeOrUpload => "mergeOrUpload".asJson
    case _ @Delete        => "delete".asJson
  }

  implicit val keyEncoder: KeyEncoder[SearchAction] = _ => "@search.action"
}

case object Upload extends SearchAction

case object Merge extends SearchAction

case object MergeOrUpload extends SearchAction

case object Delete extends SearchAction
