#!/usr/bin/env bats

load 'common.sh'

OUTPUTFILE="$BATS_TMPDIR/test-functional.feature"

teardown() {
  rm -rf $OUTPUTFILE
}

## Help

@test "[GENERATE]> Get help detail" {
  run restqa generate --help
  assert_success
  [ "${lines[0]}" =  "Usage: restqa generate|gen [global options] command" ]
  [ "${lines[1]}" =  "Generate a Test scenario from a curl command" ]
  [ "${lines[3]}" =  "  -h, --help  display help for command" ]
}

@test "[GENERATE]> Get an error if the passed command is not a curl command" {
  run restqa generate ls -lah
  assert_failure
  assert_output --partial "ReferenceError: You need to provide a curl command for me to generate an awesome scenario"
}

@test "[GENERATE]> Get an error if the curl command doesn't contain an URL" {
  run restqa generate curl -X GET
  assert_failure
  assert_output --partial "Error: You need to provide an url into your curl command"
}

@test "[GENERATE]> Generate the scenario into the output console" {
  run restqa generate curl -X GET https://jsonplaceholder.typicode.com/todos/1
  assert_success
  assert_output --partial "SCENARIO GENERATED SUCCESSFULLY"
}

@test "[GENERATE]> Generate the scenario into a file" {
  run restqa generate curl -X GET https://jsonplaceholder.typicode.com/todos/1 -o $OUTPUTFILE
  assert_success
  assert_output --partial 'The Scenario has been added to the file "'$OUTPUTFILE'"'
}
