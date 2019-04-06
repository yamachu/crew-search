package dev.yamachu.crewsearch

import dev.yamachu.crewsearch.objects._

case class Functions(logger: utils.Logger) {
  def run(req: Requests): Either[Throwable, Response] = {
    logger.info("This is common Functions run")
    req.name match {
      case "yamachu" => Right(Response())
      case _         => Left(new Exception(s"require admin user name, but ${req.name}"))
    }
  }

}
