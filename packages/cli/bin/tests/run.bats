#!/usr/bin/env bats

load 'common.sh'

## Help

@test "[RUN]> Get the help" {
  run restqa run --help
  assert_success
  assert_output --partial 'Usage: restqa run|r -c ./.restqa.yml -e local -t @success customer.feature'
  assert_output --partial 'Execute the RestQA test suite'
  assert_output --partial '-e, --env <env>        Define the current environment'
  assert_output --partial '-c, --config <config>  Use a specific .restqa.yml file'
  assert_output --partial '-t, --tags <tags>      Use --tags <EXPRESSION> to run specific features'
  assert_output --partial '-s, --silent           Hide the logs output of the microservice'
  assert_output --partial '-r, --report           Export and open the RestQA report'
  #assert_output --partial "or scenarios (example: @prod)"
  assert_output --partial '-h, --help             display help for command'
}


MAINDIR="$BATS_TMPDIR/restqa-bats-tests"
WORKDIR="$MAINDIR/run"

setup() {
  mkdir -p $WORKDIR
}

teardown() {
  rm -rf $WORKDIR
}

#Validation
@test "[RUN]> Throw error if try to run unit test but config not exist" {
  cp ./bin/tests/features/success/.restqa-no-unit-test.yml "$WORKDIR/.restqa.yml"
  cd $WORKDIR

  run restqa run

  #assert_failure Need to update
  assert_success
  assert_output --partial "Error: The local test can't be executed due to missing local test configuration"
}

@test "[RUN]> Throw error if try to run integration test but the integration config not exist" {
  cp ./bin/tests/features/success/.restqa-no-integration-test.yml "$WORKDIR/.restqa.yml"
  cd $WORKDIR

  run restqa run -e uat

  assert_failure
  assert_output --partial "Error: The integration test can't be executed due to missing integration test configuration"
}

@test "[RUN]> Throw error if try to run integration test but the environement selected not exist" {
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/.restqa.yml"
  cd $WORKDIR

  run restqa run -e PROD

  assert_failure
  assert_output --partial "Error: The environment \"PROD\" doesn't exist. Available: UAT"
}

## Test Execution
@test "[RUN]> Successfull unit test" {
  cp ./bin/tests/features/success/* "$WORKDIR/"
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/"
  cd $WORKDIR

  run restqa run -t @unit

  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Target url: http://localhost:3010'
  assert_output --partial 'Server is running (command: npm run dev)'
  assert_output --partial 'Waiting for the server to be up...'
  assert_output --partial '|> DEBUG: log'
  assert_output --partial 'Console log from the microservice'
  assert_output --partial 'PASSED - Fixture to do the functional testing > Scenario all good'
  assert_output --partial '1 passed, 1 total'
}

@test "[RUN]> Successfull unit test silent mode" {
  cp ./bin/tests/features/success/* "$WORKDIR/"
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/"
  cd $WORKDIR

  run restqa run -s -t @unit

  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Target url: http://localhost:3010'
  assert_output --partial 'Server is running (command: npm run dev)'
  assert_output --partial 'Waiting for the server to be up...'
  refute_output --partial '|> DEBUG: log'
  refute_output --partial 'Console log from the microservice'
  assert_output --partial 'PASSED - Fixture to do the functional testing > Scenario all good'
  assert_output --partial '1 passed, 1 total'
}

@test "[RUN]> Successfull integration test" {
  cp ./bin/tests/features/success/fixture.feature "$WORKDIR/"
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/"
  cd $WORKDIR

  run restqa run -e uat -t @integration
  assert_success
  assert_output --partial 'The selected environment is: "UAT"'
  assert_output --partial 'Target url: https://api.restqa.io'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> Using the alias (r) using -c options" {
  run restqa r -c ./bin/tests/features/success/.restqa.yml ./bin/tests/features/success/ -e uat -t @integration
  assert_success
  assert_output --partial 'The selected environment is: "UAT"'
  assert_output --partial '1 scenario (1 passed)'
}


## Plugin
@test "[RUN]> Plugin > exclude the node_module folder" {
  cd ./bin/tests/features/exlude_node_modules
  run restqa run -e uat
  assert_success
  assert_output --partial 'The selected environment is: "UAT"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> Plugin > exclude the node_module folder but '.' is passed as local folder" {
  cd ./bin/tests/features/exlude_node_modules
  run restqa run -e uat  .
  assert_success
  assert_output --partial 'The selected environment is: "UAT"'
  assert_output --partial '1 scenario (1 passed)'
}

## Tags

@test "[RUN]> TAG > Error if the tag doesn't start with the symbol @" {
  run restqa run -t select -c ./bin/tests/features/tags/.restqa.yml -e uat ./bin/tests/features/tags/
  assert_failure
  assert_output --partial 'Error: The tags should start with the symbol "@" (example: @select)'
}

@test "[RUN]> TAG > Run on the scenario tagged" {
  run restqa run -t @select -c ./bin/tests/features/tags/.restqa.yml  -e uat ./bin/tests/features/tags/
  assert_success
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> NO TEST > Show no scenario message" {
  cp -r ./bin/tests/features/no-test/* "$WORKDIR/"
  cp ./bin/tests/features/no-test/.restqa.yml "$WORKDIR/"
  cd $WORKDIR
  npm i
  run restqa run
  assert_success
  assert_output --partial 'NO TEST SCENARIO FOUND 😔'
}

# Plugins: http-mock

@test "[RUN]> EXEC > Execute unit test with stubs" {
  cp -r ./bin/tests/features/plugins/http-mock/* "$WORKDIR/"
  cp ./bin/tests/features/plugins/http-mock/.restqa.yml "$WORKDIR/"
  cd $WORKDIR
  npm i
  run restqa run
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Target url: http://localhost:9999'
  assert_output --partial 'Server is running (command: npm start)'
  assert_output --partial 'Waiting for the server to be up...'
  assert_output --partial 'PASSED - Hello > Scenario using mock'
  assert_output --partial '1 passed, 1 total'
}
