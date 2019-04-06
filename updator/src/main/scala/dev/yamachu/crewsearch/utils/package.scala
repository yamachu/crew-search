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
}
