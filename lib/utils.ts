import * as cdk from 'aws-cdk-lib';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache';
import { SubnetGroup } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

const PROJECT_NAME = 'bastion-host-example';

function toPascalCase(value: string): string {
  return value.split(/[-_]/).map(s => {
    return s.replace(
      /(\w)(\w*)/g,
      (_g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
    );
  }).join('');
}

export function makeResourceName(name: string) {
  return `${PROJECT_NAME}-${name}`;
}

export function makeSecrityGroup(scope: Construct, name: string, vpc: Vpc) {
  const id = toPascalCase(name);
  const resourceName = makeResourceName(name);

  const securityGroup = new SecurityGroup(scope, id, {
    securityGroupName: resourceName,
    vpc,
  });
  securityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

  return securityGroup;
}

export function makeSubnetGroup(scope: Construct, name: string, vpc: Vpc) {
  const id = toPascalCase(name);
  const resourceName = makeResourceName('redis-subnet-group');
  const vpcSubnets = vpc.selectSubnets({
    subnetType: SubnetType.PUBLIC,
  });

  return new CfnSubnetGroup(scope, id, {
    cacheSubnetGroupName: resourceName,
    description: 'redis subnet group',
    subnetIds: vpcSubnets.subnetIds,
  });
}
