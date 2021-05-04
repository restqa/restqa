#!/usr/bin/env bats

load 'common.sh'


###############################################################
###############################################################
# 
# FOR SOME REASON IT'S VERY CHALLENGING TO TEST THIS COMMAND
# THE  MAIN REASON IS  THE PROMPT ANSWERS
# THEN FOR THE MOMENT WE WILL JUST COVER SIMPLE CASE
#
###############################################################
###############################################################

## Help

@test "[INSTALL]> Get help detail" {
  run restqa install --help
  debug "${status}" "${output}" "${lines}"
  assert_success
  [ "${lines[0]}" =  "Usage: restqa install|i [options] [name]" ]
  [ "${lines[1]}" =  "Install an addon to your project" ]
  [ "${lines[3]}" =  "  -c, --config <config>  Use a specific .restqa.yml file" ]
  [ "${lines[4]}" =  "  -e, --env <env>        Define the current environment" ]
  [ "${lines[5]}" =  "  -h, --help             display help for command" ]
}

## Validation

@test "[INSTALL]> Get an error if the .restqa.yml is not found" {
  run restqa install
  assert_failure
  assert_output --partial ">  ReferenceError: The configuration file \""$PWD"/.restqa.yml\" doesn't exist."
}

@test "[INSTALL]> Get an error if the plugin doesn't exist" {
  run restqa install foo-bar
  assert_failure
  assert_output --partial '>  Error: The plugin "foo-bar" is not available. Use the command "restqa install" to retrive the list of available plugin'
}

@test "[INSTALL]> Get Error if the passed environemt doesn't exist (using the alias i)" {
  answer="jjj" #jjj as 3 times the down arrow keys to select the html output because it doesn't ask any other question
  run restqa i -c ./bin/tests/features/success/.restqa.yml -e prod <<< $answer
  assert_failure
  assert_output --partial ">  TypeError: \"prod\" is not an environment available in the config file, choose between : local"
}

@test "[INSTALL]> Successfull install of the html output but getting prompt message if the configuration file contains multiple environment" {
  cp ./bin/tests/features/multi-env/.restqa.yml "$BATS_TMPDIR/.restqa.-multienv.yml"
  run restqa install -c "$BATS_TMPDIR/.restqa.-multienv.yml" html <<< 'locale'
  assert_success
  assert_output --partial 'On which environment would you like to install the "html" outputs?'
  assert_output --partial 'The "html" outputs addon has been configured successfully'
  assert_output --partial 'Do not forget to use environment variable to secure your sensitive information'
  assert_file_contains "$BATS_TMPDIR/.restqa.-multienv.yml" "type: html"
}
