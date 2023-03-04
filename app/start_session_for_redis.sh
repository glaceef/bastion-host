#!/bin/bash

set -e

ec2_instance_id=i-0daa40c00ed000b78
redis_host=bastion-host-example-redis.uqftlq.ng.0001.use1.cache.amazonaws.com
redis_port=6379
local_port=6379

aws ssm start-session \
    --profile home \
    --region us-east-1 \
    --target "$ec2_instance_id" \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters "{
        \"host\": [\"$redis_host\"],
        \"portNumber\": [\"$redis_port\"],
        \"localPortNumber\": [\"$local_port\"]
    }"
