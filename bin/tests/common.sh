#!/usr/bin/env bats

export PATH="$PWD/bin/:$PATH"

debug() {
  status="$1"
  output="$2"
  if [[ ! "${status}" -eq "0" ]]; then
    echo "status: ${status}" >&3
    echo "output: ${output}" >&3
  fi
}

load '../../node_modules/bats-support/load'
load '../../node_modules/bats-assert/load'
