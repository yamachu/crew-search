.PHONY: azure/run azure/run-with-debug azure/build azure/build-watch dump-outdated outdated

azure/run: azure/app/Updater.jar
	cd azure/app && func host start

azure/run-with-debug: azure/app/Updater.jar
	cd azure/app && func host start --language-worker -- "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"

azure/app/Updater.jar:
	sbt azure/assembly

azure/build: 
	sbt azure/assembly

azure/build-watch:
	sbt "project azure" "~assembly"

build:
	sbt aggregate/assembly

build-watch:
	sbt "project aggregate" "~assembly"

%/target/dependency-updates.txt:
	sbt $(subst /target/dependency-updates.txt,,$@)/dependencyUpdatesReport

outdated: azure/target/dependency-updates.txt
	python ./tools/parse-dependency-updates.py $^
	@rm $^

AZURE_DEPLOY_USER=
AZURE_DEPLOY_PASSWORD=
AZURE_DEPLOY_SITE=
deploy/azure: azure/functions.zip
	@curl -X POST -u '$$$(AZURE_DEPLOY_USER):$(AZURE_DEPLOY_PASSWORD)' --data-binary @azure/functions.zip 'https://$(AZURE_DEPLOY_SITE).scm.azurewebsites.net/api/zipdeploy'

azure/functions.zip: azure/app/Updater.jar
	cd azure/app && zip -r9 ../functions.zip .
