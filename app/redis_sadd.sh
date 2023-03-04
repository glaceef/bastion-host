#!/bin/bash

set -e

cd redis_sadd/

bundle exec ruby main.rb \
  localhost \
  black_account_set \
  black_list.csv
