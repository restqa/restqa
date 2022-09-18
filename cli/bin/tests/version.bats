#!/usr/bin/env bats

load 'common.sh'

PACKAGE_VERSION=$(cat ./package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

@test "Check the version of restqa (--version)" {
  run restqa --version
  [ "$status" -eq 0 ]
  [ "${lines[0]}" =  $PACKAGE_VERSION ]
}

@test "Check the version of restqa (-v)" {
  run restqa -V
  [ "$status" -eq 0 ]
  [ "${lines[0]}" =  $PACKAGE_VERSION ]
}
