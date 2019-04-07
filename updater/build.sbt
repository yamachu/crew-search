val commonSettings = Seq(
  version := "0.1-SNAPSHOT",
  scalaVersion := "2.12.8",
  scalacOptions ++= Seq(
    "-deprecation",
    "-feature",
    "-unchecked",
    "-language:implicitConversions",
    "-Xlint",
    "-Xfatal-warnings",
    "-Ywarn-numeric-widen",
    "-Ywarn-unused",
    "-Ywarn-unused-import",
    "-Ywarn-value-discard",
  ),
)

lazy val aggregate = (project in file("aggregate"))
  .settings(commonSettings)
  .settings(
    name := "crew-search-index-updater-aggregate",
  )
  .aggregate(root, azure)

lazy val root = (project in file("."))
  .settings(commonSettings)
  .settings(
    name := "crew-search-index-updater",
    libraryDependencies ++= rootDependencies,
  )

lazy val azure = (project in file("azure"))
  .settings(commonSettings)
  .settings(
    name := "crew-search-index-updater-azure",
    libraryDependencies ++= azureDependencies,
    assemblyOutputPath in assembly := baseDirectory.value / "app" / "Updater.jar",
    assemblyMergeStrategy in assembly := {
      case PathList(ps @ _*) if ps.last endsWith ".properties" => MergeStrategy.first
      case x =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(x)
    }
  )
  .dependsOn(root)

// Todo: AWS Lambda

val azureDependencies = Seq(
  "com.microsoft.azure.functions" % "azure-functions-java-library" % "1.3.0"
)

val rootDependencies = Seq(
  "com.google.firebase" % "firebase-admin" % "6.7.0",
  "com.softwaremill.sttp" %% "core"  % "1.5.11",
  "com.softwaremill.sttp" %% "circe" % "1.5.11",
  "io.circe" %% "circe-generic" % "0.11.1",
)

scalafmtOnCompile in ThisBuild := true
