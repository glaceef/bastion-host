import * as cdk from 'aws-cdk-lib';
import { BastionHostLinux, InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { makeResourceName, makeSecrityGroup } from '../utils';

interface Props {
  vpc: Vpc,
}

export class BastionHostResource {
  public readonly securityGroup: SecurityGroup;

  constructor(scope: Construct, props: Props) {
    const { vpc } = props;

    // セキュリティグループ
    this.securityGroup = makeSecrityGroup(scope, 'bastion-host-security-group', vpc);

    // 踏み台サーバー
    const host = new BastionHostLinux(scope, 'BastionHost', {
      instanceName: makeResourceName('bastion-host'),
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      vpc,
      subnetSelection: {
        subnetType: SubnetType.PUBLIC,
      },
      securityGroup: this.securityGroup,
    });

    // S3へアクセスするためのポリシー設定
    host.role.attachInlinePolicy(
      new Policy(scope, 'BastionHostS3Policy', {
        policyName: makeResourceName('bastion-host'),
        statements: [
          new PolicyStatement({
            actions: ['s3:ListBucket'],
            resources: ['arn:aws:s3:::redis-sadd-20230304'],
          }),
          new PolicyStatement({
            actions: [
              's3:GetObject',
              's3:PutObject',
            ],
            resources: ['arn:aws:s3:::redis-sadd-20230304/*'],
          }),
        ]
      })
    );

    // 構築時に実行するコマンド
    const userDataScript = readFileSync('./lib/user-data.sh', 'utf8');
    host.instance.addUserData(userDataScript);
  }
}
