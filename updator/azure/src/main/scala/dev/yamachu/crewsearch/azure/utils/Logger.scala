package dev.yamachu.crewsearch.azure.utils

import dev.yamachu.crewsearch.utils.{Logger => BaseLogger}

case class Logger(logger: java.util.logging.Logger) extends BaseLogger {
  def info(v: String): Unit = logger.info(v)
  def warn(v: String): Unit = logger.warning(v)
}
