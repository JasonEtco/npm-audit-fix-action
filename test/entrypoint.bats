#!/usr/bin/env bats

function setup() {
  # Ensure a valid payload that this script can use
  export GITHUB_EVENT_PATH="${GITHUB_EVENT_PATH-"${BATS_TEST_DIRNAME}/event.json"}"
  # Ensure GITHUB_WORKSPACE is set
  export GITHUB_WORKSPACE="${GITHUB_WORKSPACE-"${BATS_TEST_DIRNAME}/.."}"
  
}

@test "entrypoint runs successfully" {
  run $GITHUB_WORKSPACE/entrypoint.sh
  echo "$output"
  [ "$status" -eq 0 ]
}