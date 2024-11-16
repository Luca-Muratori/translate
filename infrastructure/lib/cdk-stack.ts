import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path"
//transpile ts into js
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
//import * as route53 from 'aws-cdk-lib/aws-route53'
//import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
//import * as acm from 'aws-cdk-lib/aws-certificatemanager

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const projectRoot="../"
    const lambdasDirPath=path.join(projectRoot, "packages/lambdas")
    const lambdaLayersDirPath=path.join(projectRoot, "packages/lambda-layers")

    //here the code for route 53 deployment, I didn't use it since I want to keep this project as much low cost as possible
    //first go to namecheap.com to register a domain then create a route 53 on aws
    /*
    const domain="domain.com"
    const fullUrl=`www.${domain}`

    const zone=route53.HostedZone.fromLookup(this, "zone", {
      domainName:domain
    })

    const certificate = new acm.Certificate(this, "certificate", {
      domainName: domain,
      subjectAlternativeNames: [fullUrl]
      validation: acm.CertificateValidation.fromDns(zone)
    })

    const viewersCertificate=cloudfront.VierwerCertificate.fromAcmCertificate(
      certificate,
      {
        aliases: [domain, fullUrl]
      }
    )
    */



    //dynamodb construct here
    const table=new dynamodb.Table(this, "translations", {
      tableName:"translation",
      partitionKey:{
        name:"requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy:cdk.RemovalPolicy.DESTROY
    })

    //policy attahced to lambda allowing access to the tralsate resource
    const translateServicePolicy=new iam.PolicyStatement({
      actions:["translate:TranslateText"],
      resources:["*"]
    })
    
    const translateTablePolicy=new iam.PolicyStatement({
      actions:[
        "dynamodb:PutItem",
        "dynamodb:scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
      ],
      resources:["*"]
    })

    //api top level construct
    const translateLambdaPath= path.join(lambdasDirPath, "translate/index.ts")

    const utilsLambdaLayerPath=path.resolve(path.join(lambdaLayersDirPath, "utils-lambda-layer"))

    const utilsLambdaLayer=new lambda.LayerVersion(this, "utilsLambdaLayer",{
      code:lambda.Code.fromAsset(utilsLambdaLayerPath),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      removalPolicy:cdk.RemovalPolicy.DESTROY
    })

    const restapi= new apigateway.RestApi(this, 'timeofdayrestapi')

    const translateLambda=new lambdanodejs.NodejsFunction(this, "translateLambda", {
      //where the code for the function is located in this project
      entry: translateLambdaPath,
      //handler: name of the function
      handler: "translate",
      runtime: lambda.Runtime.NODEJS_20_X, 
      initialPolicy: [translateServicePolicy, translateTablePolicy],
      layers:[utilsLambdaLayer],
      environment:{
        TRANSLATION_TABLE_NAME:table.tableName,
        TRANSLATION_PARTITION_KEY: "requestId"
      }
    })

    restapi.root.addMethod("POST", new apigateway.LambdaIntegration(translateLambda))

    //get translation lambda
    const getTranslationSLambda=new lambdanodejs.NodejsFunction(this, "getTranslation", {
      //where the code for the function is located in this project
      entry: translateLambdaPath,
      //handler: name of the function
      handler: "getTranslatons",
      runtime: lambda.Runtime.NODEJS_20_X, 
      initialPolicy: [translateTablePolicy],
      layers:[utilsLambdaLayer],
      environment:{
        TRANSLATION_TABLE_NAME:table.tableName,
        TRANSLATION_PARTITION_KEY: "requestId"
      }
    })

    restapi.root.addMethod("GET", new apigateway.LambdaIntegration(getTranslationSLambda))

    //bucket where website dist will be stored
    const bucket=new s3.Bucket(this, "websitebucket", {
      websiteIndexDocument:'index.html',
      websiteErrorDocument:  '404.html',
      publicReadAccess: true,
      blockPublicAccess:{
        blockPublicAcls:false,
        blockPublicPolicy: false,
        ignorePublicAcls:false,
        restrictPublicBuckets:false
      },
      removalPolicy:cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })

    

    const distro= new cloudfront.CloudFrontWebDistribution(
      this,
      "websitecloudfrontdistro",
      {
        //viewerCertificate
        originConfigs:[
          {
            s3OriginSource:{
              s3BucketSource:bucket
            },
            behaviors:[
              {
                isDefaultBehavior:true,

              }
            ]
          }
        ]
      }
    )

    //s3 construct to deploy website content
    new s3deploy.BucketDeployment(this, "websitedeploy", {
      destinationBucket:bucket,
      sources:[s3deploy.Source.asset('../apps/frontend/dist')],
      distribution: distro,
      distributionPaths:['/*']
    })

    /*route53
    new route53.ARecord(this, "route53Domain", {
      zone,
      recordName: domain
      target: route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distro))
    })
    new route53.ARecord(this, "route53FullDomain", {
      zone,
      recordName: fullUrl
      target: route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distro))
    })
    */

    new cdk.CfnOutput(this, 'weburl',{
      exportName:"weburl",
      value:`https://${distro.distributionDomainName}`
    })
  }
}
