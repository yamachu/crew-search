package dev.yamachu.crewsearch.services

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.{FirebaseApp, FirebaseOptions}
import com.google.firebase.auth.FirebaseAuth
import dev.yamachu.crewsearch.utils._

trait FirebaseAuthService {
  def verifyEmail(token: String, email: String): Either[Throwable, Boolean]
}

class MockFirebaseAuthService extends FirebaseAuthService {
  override def verifyEmail(token: String, email: String): Either[Throwable, Boolean] = Right(true)
}

object FirebaseAuthService {
  lazy val instance: FirebaseAuthService = {
    val app = using(getClass.getResourceAsStream("/serviceAccountKey.json")) { in =>
      val option = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(in))
        .build()
      FirebaseApp.initializeApp(option)
    }
    val auth = FirebaseAuth.getInstance(app)
    new FirebaseAuthServiceImpl(auth)
  }
}
