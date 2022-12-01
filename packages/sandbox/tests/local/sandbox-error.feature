Feature: Error cases

Scenario: Error message if the api is not restful json
Given the upstream path "GET" "/devices" should respond:
  """
  Not found
  """
When upstream starts on port 9999
Given a request
When GET "/devices"
  And upstream stops
  And the file "tests-generated/local/GET_devices.feature" not exists
  And the console print:
  """
  ------------------------------------------
  ❌ Sorry at the moment RestQA Sandbox only handle JSON response
  ------------------------------------------
  """
