#!/usr/bin/env bats

load 'common.sh'

## Help

@test "[EDITOR]> Get help detail" {
  run restqa editor --help
  assert_success
  [ "${lines[0]}" =  "Usage: restqa editor|e [options]" ]
  [ "${lines[1]}" =  "Launch the restqa editor web server" ]
  [ "${lines[3]}" =  "  -c, --config <config>  Use a specific .restqa.yml file" ]
  [ "${lines[4]}" =  "  -p, --port <port>      Define the running port (default: 8081)" ]
  [ "${lines[5]}" =  "  -h, --help             display help for command" ]
}

## Validation

@test "[EDITOR]> Get an error if the port is not a number" {
  run restqa editor --port hello
  assert_failure
  assert_output --partial '>  Error: The port should be a number. (example: 8081)'
}

@test "[EDITOR]> Get an error if the config doesn't exist" {
  run restqa editor --config hello.yml
  assert_failure
  assert_output --partial ">  Error: The configuration file \"hello.yml\" doesn't exist."
}

#@test "[EDITOR]> Run with the default parameters" {
#  cd bin/tests/features/success
#  assert_success
#  assert_output --partial ">  Error: The configuration file \"hello.yml\" doesn't exist."
#}
