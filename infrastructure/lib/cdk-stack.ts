import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path"
//transpile ts into js
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'


// class ImageGallery extends Construct{
//   constructor(scope: Construct, id: string, props?:cdk.StackProps){
//     super(scope, id)

//     new cdk.aws_s3.Bucket(this, "somes3bucket", {
//       versioned:false,
//       removalPolicy:cdk.RemovalPolicy.DESTROY,
//       autoDeleteObjects:true
//     })
//     new cdk.aws_s3.Bucket(this, "thumbnails3", {
//       versioned:false,
//       removalPolicy:cdk.RemovalPolicy.DESTROY,
//       autoDeleteObjects:true
//     })
//   }
// }


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const projectRoot="../"
    const lambdasDirPath=path.join(projectRoot, "packages/lambdas")

    //policy attahced to lambda allowing access to the tralsate resource
    const translateAccessPolicy=new iam.PolicyStatement({
      actions:["translate:TranslateText"],
      resources:["*"]
    })
    const translateLambdaPath= path.join(lambdasDirPath, "translate/index.ts")
    const labdafunc=new lambdanodejs.NodejsFunction(this, "timeofday", {
      //where the code for the function is located in this project
      entry: translateLambdaPath,
      //handler: name of the function
      handler: "index",
      runtime: lambda.Runtime.NODEJS_20_X, 
      initialPolicy: [translateAccessPolicy]
    })
    // new ImageGallery(this, "imagebucket")

    const restapi= new apigateway.RestApi(this, 'timeofdayrestapi')
    restapi.root.addMethod("POST", new apigateway.LambdaIntegration(labdafunc))
  }
}
