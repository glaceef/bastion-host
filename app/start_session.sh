#!/bin/bash

set -e

ec2_instance_id=i-0f4ca4abf1841a12d

aws ssm start-session \
    --profile home \
    --region us-east-1 \
    --target "$ec2_instance_id"
