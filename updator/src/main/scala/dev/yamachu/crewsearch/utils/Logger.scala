package dev.yamachu.crewsearch.utils

trait Logger {
  def info(v: String): Unit
  def warn(v: String): Unit
}
