# Custom step definition

## Description

A simple example on how you can extend the RestQA's built-in step definition.

# Use Case

The endpoint `POST /create-file` is creating a file when it's getting requested, we would like to have a step definition that could assert that file has been created successfully.

# Focus part

* [tests/custom-steps.cjs](tests/custom-steps.cjs)
* [tests/local/post-create-file.feature](tests/local/post-create-file.feature)
