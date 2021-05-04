#!/usr/bin/env bats

load 'common.sh'

## Help

@test "[EXAMPLE]> Get the help" {
  run restqa example --help
  assert_success
  assert_output --partial 'Run a simple RestQA example'
  assert_output --partial '-h, --help  display help for command'
}

## Test Execution

@test "[EXAMPLE]> Successfull test" {
  run restqa example
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '13 scenarios (1 skipped, 12 passed'
}

@test "[EXAMPLE]> Using the alias (ex)" {
  run restqa ex
  assert_success
  assert_output --partial 'The selected environment is: "local"'
  assert_output --partial '13 scenarios (1 skipped, 12 passed'
}
