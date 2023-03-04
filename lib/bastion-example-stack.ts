import * as cdk from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';
import { BastionHostResource } from './resources/bastion-host';
import { VpcResource } from './resources/vpc';

export class BastionExampleStack extends cdk.Stack {
  public readonly vpc: Vpc;
  public readonly bastionHostSecurityGroup: SecurityGroup;
  public readonly redisSecurityGroup: SecurityGroup;
  public readonly redisSubnetGroup: CfnSubnetGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* VPC作成 */
    this.vpc = new VpcResource(this).vpc;

    /* 踏み台サーバー作成 */
    new BastionHostResource(this, {
      vpc: this.vpc,
    });

    /* Redis用に先にリソースを作っておく */
    /*
    // セキュリティグループ
    this.redisSecurityGroup = makeSecrityGroup(this, 'redis-security-group', this.vpc);
    // サブネットグループ
    this.redisSubnetGroup = makeSubnetGroup(this, 'redis-subnet-group', this.vpc);
    */
  }
}
