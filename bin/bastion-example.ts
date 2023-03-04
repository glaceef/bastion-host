#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BastionExampleStack } from '../lib/bastion-example-stack';
import { RedisStack } from '../lib/redis-stack';

const env = {
  accountId: '437307506719',
  region: 'us-east-1',
};

const app = new cdk.App();

new BastionExampleStack(app, 'BastionExampleStack', {
  env,
});
