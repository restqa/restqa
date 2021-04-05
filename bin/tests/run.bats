#!/usr/bin/env bats

load 'common.sh'

@test "Get an error if the .restqa.yml is not found" {
  run restqa run ./bin/tests/features
  [ "$status" -eq  1 ]
  [ "${lines[0]}" =  ">  Error: The configuration file \""$PWD"/.restqa.yml\" doesn't exist." ]
}

@test "Get an error if the passed config file is not found (--config)" {
  run restqa run --config .fake.yml ./bin/tests/features
  #debug "${status}" "${output}" "${lines}"
  [ "$status" -eq  1 ]
  [ "${lines[0]}" =  ">  Error: The configuration file \".fake.yml\" doesn't exist." ]
}

@test "Get an error if the passed config file is not found (-c)" {
  run restqa run -c .fake.yml ./bin/tests/features
  #debug "${status}" "${output}" "${lines}"
  [ "$status" -eq  1 ]
  [ "${lines[0]}" =  ">  Error: The configuration file \".fake.yml\" doesn't exist." ]
}

@test "Successfull test" {
  run restqa run -c ./bin/tests/features/success/.restqa.yml ./bin/tests/features/success/
  assert_success
  assert_output --partial '1 scenario (1 passed)'
}

## Multi environment 

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
  run restqa run -e local -c ./bin/tests/features/multi-env/.restqa.yml ./bin/tests/features/multi-env/
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '1 scenario (1 passed)'
}

@test "[RUN]> MULTI-ENV > Run successfull test on the default environement" {
  run restqa run -c ./bin/tests/features/multi-env/.restqa.yml ./bin/tests/features/multi-env/
  debug "${status}" "${output}" "${lines}"
  assert_success
  assert_output --partial 'The selected environment is: "uat"'
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
