#!/usr/bin/env bats

load 'common.sh'

## Help

@test "[DASHBOARD]> Get help detail" {
  run restqa dashboard --help
  assert_success
  [ "${lines[0]}" =  "Usage: restqa dashboard|d [options]" ]
  [ "${lines[1]}" =  "Launch the RestQA Dashboard web server" ]
  [ "${lines[2]}" =  "Options:" ]
  [ "${lines[3]}" =  "  --no-config            Run the dashboad on \"no config\" mode" ]
  assert_output --partial "  -c, --config <config>  Use a specific .restqa.yml file"
  [ "${lines[6]}" =  "  -p, --port <port>      Define the running port (default: 8081)" ]
  [ "${lines[7]}" =  "  -h, --help             display help for command" ]
}

## Validation

@test "[DASHBOARD]> Get an error if the port is not a number" {
  run restqa dashboard --port hello
  assert_failure
  assert_output --partial '>  Error: The port should be a number. (example: 8081)'
}

@test "[DASHBOARD]> Get an error if the config doesn't exist" {
  run restqa dashboard --config hello.yml
  assert_failure
  assert_output --partial ">  Error: The configuration file \"hello.yml\" doesn't exist."
}

@test "[DASHBOARD]> Run with the default parameters" {
  cd bin/tests/features/success
  run timeout 3s restqa dashboard
  debug $status $output
  assert_failure
  [ "$status" -eq 124 ] # If the request is timing out, it means the server is running
}

@test "[DASHBOARD]> Run with no config" {
  run timeout 3s restqa dashboard --no-config
  debug $status $output
  assert_failure
  [ "$status" -eq 124 ] # If the request is timing out, it means the server is running
}
