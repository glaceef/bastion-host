#!/bin/bash

set -e

ec2_instance_id=i-0daa40c00ed000b78
db_host=bastion-host-example-rds.c6kdfza6ofkj.us-east-1.rds.amazonaws.com
db_port=5432
local_port=5432

aws ssm start-session \
    --profile home \
    --region us-east-1 \
    --target "$ec2_instance_id" \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters "{
        \"host\": [\"$db_host\"],
        \"portNumber\": [\"$db_port\"],
        \"localPortNumber\": [\"$local_port\"]
    }"
