
@test "Check the help of restqa (--help)" {
  run restqa --help
  [ "$status" -eq 0 ]
  [ "${lines[0]}" =  "Usage: restqa [options] [command]" ]
}


@test "Check the help of restqa (-h)" {
  run restqa -h
  [ "$status" -eq 0 ]
  [ "${lines[0]}" =  "Usage: restqa [options] [command]" ]
}
