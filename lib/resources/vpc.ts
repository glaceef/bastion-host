import { GatewayVpcEndpointAwsService, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { makeResourceName } from '../utils';

export class VpcResource {
  public readonly vpc: Vpc;

  constructor(scope: Construct) {
    // VPC作成
    this.vpc = new Vpc(scope, 'Vpc', {
      vpcName: makeResourceName('vpc'),
      cidr: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 2,
      natGateways: 0, // Elastic IP を作成しないための設定
      subnetConfiguration: [
        {
          name: makeResourceName('subnet'),
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    this.vpc.addGatewayEndpoint("S3Endpoint", {
      service: GatewayVpcEndpointAwsService.S3,
      subnets: [{
        subnetType: SubnetType.PUBLIC,
      }],
    });
  }
}
