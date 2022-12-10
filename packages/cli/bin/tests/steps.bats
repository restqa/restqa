#!/usr/bin/env bats

load 'common.sh'

## Help

@test "[STEPS]> Get help detail" {
  run restqa steps --help
  assert_success
  [ "${lines[0]}" =  "Usage: restqa steps|st [options] [keyword]" ]
  [ "${lines[1]}" =  "Get the list of step by keyword : given | when | then" ]
  [ "${lines[3]}" =  "  -c, --config <config>  Use a specific .restqa.yml file" ]
  [ "${lines[4]}" =  "  -t, --tag <tag>        Filter the step definition by tag" ]
  [ "${lines[5]}" =  "  -o, --output <output>  Formating the output: short | medium | large" ]
  [ "${lines[6]}" =  "  -h, --help             display help for command" ]
}

MAINDIR="$BATS_TMPDIR/restqa-bats-tests"
WORKDIR="$MAINDIR/steps"

setup_file() {
  echo "--> Installing the npm package @restqa/faker-plugin into the $MAINDIR folder" >&3
  npm install @restqa/plugin-faker --prefix $MAINDIR
}

setup() {
  mkdir -p $WORKDIR
  cp -r "$MAINDIR/node_modules" "$WORKDIR/"
}

teardown() {
  rm -rf $WORKDIR
}

## Validation

@test "[STEPS]> Get an error if the keyword is not passed" {
  run restqa steps
  assert_failure
  assert_output --partial 'TypeError: Provide a keyword. Available: given | when | then'
}

@test "[STEPS]> Get an error if the .restqa.yml is not found" {
  run restqa steps given
  assert_failure
  assert_output --partial "ReferenceError: The configuration file located at \""$PWD"/.restqa.yml\" doesn't exist."
}

@test "[STEPS]> Get an error if the keyword doesn't exist" {
  run restqa st Sachant
  assert_failure
  assert_output --partial 'TypeError: "Sachant" is not a valid argument. Available: given | when | then'
}

@test "[STEPS]> Get Error if the output is not valid" {
  run restqa st -c ./bin/tests/features/success/.restqa.yml -o hello given
  assert_failure
  assert_output --partial "TypeError: \"hello\" is not a valid output. Available: short | medium | large"
}

## Happy

@test "[STEPS]> Retrieve the steps successfully" {
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/.restqa.-success.yml"
  cd $WORKDIR
  run restqa steps -c "$WORKDIR/.restqa.-success.yml" given
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  assert_output --partial 'Comment'
  assert_output --partial 'rest-api'
  assert_output --partial 'given'
  assert_output --partial 'a request'
  assert_output --partial 'Create a new api request targeting the current service'
}

@test "[STEPS]> Retrieve the steps successfully using the alias (step)" {
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/.restqa.-success.yml"
  cd $WORKDIR
  run restqa step -c "$WORKDIR/.restqa.-success.yml" given
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  assert_output --partial 'Comment'
  assert_output --partial 'rest-api'
  assert_output --partial 'given'
  assert_output --partial 'a request'
  assert_output --partial 'Create a new api request targeting the current service'
}


@test "[STEPS]> Retrieve the steps successfully using the alias (st)" {
  cp ./bin/tests/features/success/.restqa.yml "$WORKDIR/.restqa.-success.yml"
  cd $WORKDIR
  run restqa st -c "$WORKDIR/.restqa.-success.yml" given
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  assert_output --partial 'Comment'
  assert_output --partial 'rest-api'
  assert_output --partial 'given'
  assert_output --partial 'a request'
  assert_output --partial 'Create a new api request targeting the current service'
}

@test "[STEPS]> Successfull multi-plugin" {
  cp ./bin/tests/features/success/.restqa-plugin-faker.yml "$WORKDIR/.restqa.-success-faker.yml"
  cd $WORKDIR
  run restqa steps -c "$WORKDIR/.restqa.-success-faker.yml" given
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  assert_output --partial 'Comment'
  assert_output --partial 'rest-api'
  assert_output --partial 'given'
  assert_output --partial 'a request'
  assert_output --partial 'Create a new api request targeting the current service'
  assert_output --partial 'faker'
  assert_output --partial 'given'
  assert_output --partial 'fake locale = {string}'
  assert_output --partial 'Define the local to user for the fake data'
}

@test "[STEPS]> Successfull multi-plugin but filter per tag" {
  cp ./bin/tests/features/success/.restqa-plugin-faker.yml "$WORKDIR/.restqa.-success-faker.yml"
  cd $WORKDIR
  run restqa steps -c "$WORKDIR/.restqa.-success-faker.yml" given -t url -o large
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  assert_output --partial 'Comment'
  # assert_line --index 3 --partial '─────'
  assert_line --index 4 --partial 'rest-api'
  assert_line --index 4 --partial 'given'
  assert_line --index 4 --partial 'a request'
  assert_line --index 4 --partial 'Create a new api request targeting the current service'
  assert_line --index 5 --partial 'rest-api'
  assert_line --index 5 --partial 'given'
  assert_line --index 5 --partial 'a request hosted on {string}'
  assert_line --index 5 --partial 'Create a new api request targeting on a given api gateway'
  # assert_line --index 6 --partial '─────'
  refute_output --partial 'faker'
  refute_output --partial 'I have my cluster'
  refute_output --partial 'Create a cluster instance'
}

@test "[STEPS]> Successfull multi-plugin but filter per tag and short output" {
  cp ./bin/tests/features/success/.restqa-plugin-faker.yml "$WORKDIR/.restqa.-success-faker.yml"
  cd $WORKDIR
  run restqa steps -c "$WORKDIR/.restqa.-success-faker.yml" given -t url -o short
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  refute_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  refute_output --partial 'Comment'
  # assert_line --index 3 --partial '─────'
  refute_output --index 4 --partial 'rest-api'
  assert_line --index 4 --partial 'given'
  assert_line --index 4 --partial 'a request'
  refute_output --index 4 --partial 'Create a new api request targeting the current service'
  refute_output --index 5 --partial 'rest-api'
  assert_line --index 5 --partial 'given'
  assert_line --index 5 --partial 'a request hosted on {string}'
  refute_line --index 5 --partial 'Create a new api request targeting on a given api gateway'
  # assert_line --index 6 --partial '─────'
}

@test "[STEPS]> Successfull multi-plugin but filter per tag and medium output" {
  cp ./bin/tests/features/success/.restqa-plugin-faker.yml "$WORKDIR/.restqa.-success-faker.yml"
  cd $WORKDIR
  run restqa steps -c "$WORKDIR/.restqa.-success-faker.yml" given -t url --output medium
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial 'Plugin'
  assert_output --partial 'Keyword'
  assert_output --partial 'Step'
  refute_output --partial 'Comment'
  # assert_line --index 3 --partial '─────'
  assert_line --index 4 --partial 'rest-api'
  assert_line --index 4 --partial 'given'
  assert_line --index 4 --partial 'a request'
  refute_output --index 4 --partial 'Create a new api request targeting the current service'
  assert_line --index 5 --partial 'rest-api'
  assert_line --index 5 --partial 'given'
  assert_line --index 5 --partial 'a request hosted on {string}'
  refute_output --index 5 --partial 'Create a new api request targeting on a given api gateway'
  # assert_line --index 6 --partial '─────'
}
