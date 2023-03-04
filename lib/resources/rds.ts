import * as cdk from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, ParameterGroup, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { makeResourceName, makeSecrityGroup } from '../utils';

interface Props {
  vpc: Vpc,
  bastionHostSecurityGroup: SecurityGroup,
}

export class RdsResource {
  constructor(scope: Construct, props: Props) {
    const {
      vpc,
      bastionHostSecurityGroup,
    } = props;

    // セキュリティグループ
    const securityGroup = makeSecrityGroup(scope, 'rds-security-group', vpc);

    // エンジン
    const engine = DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_14_3,
    });

    // インスタンス
    new DatabaseInstance(scope, 'DatabaseInstance', {
      instanceIdentifier: makeResourceName('rds'),
      engine,
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
      credentials: Credentials.fromPassword('multi', cdk.SecretValue.unsafePlainText('hmx-1212')),
      backupRetention: cdk.Duration.days(7),
      storageEncrypted: true,

      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      securityGroups: [securityGroup],

      cloudwatchLogsExports: ['postgresql'],
      cloudwatchLogsRetention: RetentionDays.ONE_WEEK,
    });

    // 自宅許可
    // `curl http://checkip.amazonaws.com` で調べた。
    securityGroup.addIngressRule(Peer.ipv4('59.138.20.188/32'), Port.tcp(5432), 'from home');
    // 踏み台サーバー許可
    securityGroup.addIngressRule(bastionHostSecurityGroup, Port.tcp(5432), 'from bastion-host');
    // 自身許可
    securityGroup.addIngressRule(securityGroup, Port.tcp(5432), 'from me');
  }
}
