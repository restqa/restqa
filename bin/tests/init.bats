#!/usr/bin/env bats

load 'common.sh'

@test "[INIT]> Init with -y" {
  run restqa init -y
  assert_success
  assert_output --partial 'You have successfully installed RestQA! Let’s begin your test automation with RestQA 💥🚀'
  assert_output --partial '🎁 We created a sample scenario, try it by using the command: restqa run'
  assert_output --partial '👉 More information: https://restqa.io/info'
}