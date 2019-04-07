package dev.yamachu.crewsearch.services

import com.google.firebase.auth.{FirebaseAuth, FirebaseToken}

import scala.util.control.Exception.catching

class FirebaseAuthServiceImpl(val auth: FirebaseAuth) extends FirebaseAuthService {
  override def verifyEmail(token: String, email: String): Either[Throwable, Boolean] =
    for {
      firebaseToken <- verify(token)
    } yield email == firebaseToken.getEmail

  def verify(token: String): Either[Throwable, FirebaseToken] =
    catching(classOf[Throwable]) either auth.verifyIdToken(token)
}
