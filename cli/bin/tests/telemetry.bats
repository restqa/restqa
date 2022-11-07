#!/usr/bin/env bats

load 'common.sh'

## Help

@test "[TELEMETRY]> Get help detail" {
  run restqa telemetry --help
  assert_success
  [ "${lines[0]}" =  "Usage: restqa telemetry [status]" ]
  [ "${lines[1]}" =  "Enable or disable the telemetry" ]
  [ "${lines[2]}" =  "Arguments:" ]
  [ "${lines[3]}" =  "  status      status of the telemetry (choices: \"on\", \"off\")" ]
  [ "${lines[4]}" =  "Options:" ]
  [ "${lines[5]}" =  "  -h, --help  display help for command" ]
}


@test "[TELEMETRY]> Incorrect values on trying to use the telemetry" {
  run restqa telemetry true
  assert_failure
  [ "${lines[0]}" =  "Error: The status is incorrect. Available: on | off" ]
}

@test "[TELEMETRY]> Enabled the telemetry" {
  rm -rf ~/.config/restqa.pref
  run restqa telemetry on
  TELEMETRY_STATUS=$(cat ~/.config/restqa.pref \
    | grep telemetry \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[,].*//g')
  assert_success
  assert_output --partial "The telemetry has been enabled"
  assert_equal "$TELEMETRY_STATUS"  "true"
  rm -rf ~/.config/restqa.pref
}

@test "[TELEMETRY]> Disabled the telemetry" {
  rm -rf ~/.config/restqa.pref
  run restqa telemetry off
  TELEMETRY_STATUS=$(cat ~/.config/restqa.pref \
    | grep telemetry \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[,].*//g')
  assert_success
  assert_output --partial "The telemetry has been disabled"
  [ $TELEMETRY_STATUS = "false" ]
  rm -rf ~/.config/restqa.pref
}
