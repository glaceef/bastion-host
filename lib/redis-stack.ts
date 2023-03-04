import * as cdk from 'aws-cdk-lib';
import { Port } from 'aws-cdk-lib/aws-ec2';
import { CfnReplicationGroup } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';
import { BastionExampleStack } from './bastion-example-stack';
import { makeResourceName } from './utils';

interface RedisStackProps extends cdk.StackProps {
  bastionExampleStack: BastionExampleStack,
}

export class RedisStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RedisStackProps) {
    super(scope, id, props);

    const { bastionExampleStack } = props;
    const bastionHostSecurityGroup = bastionExampleStack.bastionHostSecurityGroup;
    const redisSecurityGroup = bastionExampleStack.redisSecurityGroup;
    const redisSubnetGroup = bastionExampleStack.redisSubnetGroup;

    // Redis作成
    new CfnReplicationGroup(this, 'Redis', {
      automaticFailoverEnabled: false,
      cacheNodeType: 'cache.t4g.small',
      cacheParameterGroupName: '',
      cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
      engine: 'redis',
      engineVersion: '5.0.6',
      multiAzEnabled: false,
      numCacheClusters: 2,
      replicationGroupId: makeResourceName('redis'),
      replicationGroupDescription: 'redis',
      securityGroupIds: [redisSecurityGroup.securityGroupId],
      snapshotRetentionLimit: 1,
    });

    // 踏み台サーバー許可
    redisSecurityGroup.addIngressRule(bastionHostSecurityGroup, Port.tcp(6379), 'from bastion-host');
  }
}
