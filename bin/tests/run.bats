#!/usr/bin/env bats

load 'common.sh'

## Validation

@test "[RUN]> Get an error if the .restqa.yml is not found" {
  run restqa run ./bin/tests/features
  assert_failure
  [ "${lines[0]}" =  ">  TypeError: The configuration file \""$PWD"/.restqa.yml\" doesn't exist." ]
}

@test "[RUN]> Get an error if the passed config file is not found (--config)" {
  run restqa run --config .fake.yml ./bin/tests/features
  #debug "${status}" "${output}" "${lines}"
  assert_failure
  [ "${lines[0]}" =  ">  TypeError: The configuration file \".fake.yml\" doesn't exist." ]
}

@test "[RUN]> Get an error if the passed config file is not found (-c)" {
  run restqa run -c .fake.yml ./bin/tests/features
  #debug "${status}" "${output}" "${lines}"
  assert_failure
  [ "${lines[0]}" =  ">  TypeError: The configuration file \".fake.yml\" doesn't exist." ]
}

## Help

@test "[RUN]> Get the help" {
  run restqa run --help
  assert_success
  assert_output --partial 'Usage: restqa run|r -c ./.restqa.yml -e local -t @success customer.feature'
  assert_output --partial 'Execute the RestQA test suite'
  assert_output --partial '-e, --env <env>        Define the current environment'
  assert_output --partial '-c, --config <config>  Use a specific .restqa.yml file'
  assert_output --partial '-t, --tags <tags>      Use --tags <EXPRESSION> to run specific features'
  #assert_output --partial "or scenarios (example: @prod)"
  assert_output --partial '-h, --help             display help for command'
}

## Test Execution

@test "[RUN]> Successfull test" {
  run restqa run -c ./bin/tests/features/success/.restqa.yml ./bin/tests/features/success/
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> Using the alias (r)" {
  run restqa r -c ./bin/tests/features/success/.restqa.yml ./bin/tests/features/success/
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> Test successfully pass even if the environment is not defined as default because only one environment is available" {
  run restqa r -c ./bin/tests/features/success/.restqa-no-default.yml ./bin/tests/features/success/
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

## Multi environment 

@test "[RUN]> MULTI-ENV > Fail test if no environement is passed and there is any environement has default parameter set to true" {
  run restqa run -c ./bin/tests/features/multi-env/.restqa-no-default.yml ./bin/tests/features/multi-env/
  assert_failure
  assert_output --partial 'Error: THE ENVIRONMENT NEEDS TO BE DEFINED AS (local | uat)'
}

@test "[RUN]> MULTI-ENV > Fail Test when environment doesn't exist" {
  run restqa run -e prod -c ./bin/tests/features/multi-env/.restqa.yml ./bin/tests/features/multi-env/
  assert_failure
  assert_output --partial 'Error: THE ENVIRONMENT NEEDS TO BE DEFINED AS (local | uat)'
}

@test "[RUN]> MULTI-ENV > Run successfull test on the uat environement" {
  run restqa run -e uat -c ./bin/tests/features/multi-env/.restqa.yml ./bin/tests/features/multi-env/
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "uat"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> MULTI-ENV > Run successfull test on the local environement" {
  cd ./bin/tests/features/multi-env
  run restqa run -e local
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> MULTI-ENV > Run successfull test on the default environement" {
  cd ./bin/tests/features/multi-env
  run restqa run
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "uat"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> Plugin > exclude the node_module folder" {
  cd ./bin/tests/features/exlude_node_modules
  run restqa run 
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> Plugin > exclude the node_module folder but '.' is passed as local folder" {
  cd ./bin/tests/features/exlude_node_modules
  run restqa run  .
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

## Tags

@test "[RUN]> TAG > Error if the tag doesn't start with the symbol @" {
  run restqa run -t select -c ./bin/tests/features/tags/.restqa.yml ./bin/tests/features/tags/
  assert_failure
  assert_output --partial '>  Error: The tags should start with the symbol "@" (example: @select)'
}

@test "[RUN]> TAG > Run on the scenario taggdd" {
  run restqa run -t @select -c ./bin/tests/features/tags/.restqa.yml ./bin/tests/features/tags/
  assert_success
  assert_output --partial '1 scenario (1 passed)'
}
