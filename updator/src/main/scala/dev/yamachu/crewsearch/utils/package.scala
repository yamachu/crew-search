package dev.yamachu.crewsearch

import scala.language.reflectiveCalls

package object utils {
  // ref: http://tototoshi.hatenablog.com/entry/20111107/1320673925
  def using[A, R <: { def close() }](r: R)(f: R => A): A =
    try {
      f(r)
    } finally {
      r close ()
    }

  // ref: https://stackoverflow.com/questions/1226555/case-class-to-map-in-scala
  def ccToMap(cc: AnyRef): Map[String, Any] =
    (Map[String, Any]() /: cc.getClass.getDeclaredFields) { (a, f) =>
      f.setAccessible(true)
      a + (f.getName -> f.get(cc))
    }
}
