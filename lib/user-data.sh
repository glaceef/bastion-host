#!/bin/bash

set -e

# environments
export TZ=Asia/Tokyo

# psql
amazon-linux-extras install postgresql14

# redis
amazon-linux-extras install redis6

# ruby
amazon-linux-extras install ruby3.0
gem install bundler
