import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { frontEndDistPath } from "../helpers";
//import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
//import * as route53 from 'aws-cdk-lib/aws-route53'
//import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
//import * as acm from 'aws-cdk-lib/aws-certificatemanager

export interface IStaticWebsiteDeploymentProps extends cdk.StackProps {
  //domain: string;
  //fullUrl: string
  //certificate: acm.Certificate
  //zone-: route53.IHostedZone
}

export class StaticWebsiteDeployment extends Construct {
  public restApi: apigateway.RestApi;
  constructor(
    scope: Construct,
    id: string,
    //{ /*apiUrl, fullUrl,  certificate, zone*/ }: IStaticWebsiteDeploymentProps
  ) {
    super(scope, id);
    //bucket where website dist will be stored
    const bucket = new s3.Bucket(this, "websitebucket", {
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "404.html",
        publicReadAccess: true,
        blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });
      const distro = new cloudfront.CloudFrontWebDistribution(
        this,
        "websitecloudfrontdistro",
        {
          //viewerCertificate
          originConfigs: [
            {
              s3OriginSource: {
                s3BucketSource: bucket,
              },
              behaviors: [
                {
                  isDefaultBehavior: true,
                },
              ],
            },
          ],
        }
      );

      //s3 construct to deploy website content
    new s3deploy.BucketDeployment(this, "websitedeploy", {
        destinationBucket: bucket,
        sources: [s3deploy.Source.asset(frontEndDistPath)],
        distribution: distro,
        memoryLimit: 512,
        distributionPaths: ["/*"],
      });

    /*route53
    const viewersCertificate=cloudfront.VierwerCertificate.fromAcmCertificate(
      certificate,
      {
        aliases: [domain, fullUrl]
      }
    )
    new route53.ARecord(this, "route53Domain", {
      zone,
      recordName: domain
      target: route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distro))
    })
    new route53.ARecord(this, "route53FullUrl", {
      zone,
      recordName: "www"
      target: route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distro))
    })
    new route53.ARecord(this, "apidns", {
      zone,
      recordName: "api"
      target: route53.RecordTarget.fromAlias(
      new route53Targets.ApiGateway(restApi))
    })
    */
      
    new cdk.CfnOutput(this, "weburl", {
        exportName: "weburl",
        value: `https://${distro.distributionDomainName}`,
      });
  }


}
