import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path"
//transpile ts into js
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const projectRoot="../"
    const lambdasDirPath=path.join(projectRoot, "packages/lambdas")


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
    const restapi= new apigateway.RestApi(this, 'timeofdayrestapi')

    const translateLambdaPath= path.join(lambdasDirPath, "translate/index.ts")
    const translateLambda=new lambdanodejs.NodejsFunction(this, "translateLambda", {
      //where the code for the function is located in this project
      entry: translateLambdaPath,
      //handler: name of the function
      handler: "translate",
      runtime: lambda.Runtime.NODEJS_20_X, 
      initialPolicy: [translateServicePolicy, translateTablePolicy],
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
      handler: "getTranslations",
      runtime: lambda.Runtime.NODEJS_20_X, 
      initialPolicy: [translateTablePolicy],
      environment:{
        TRANSLATION_TABLE_NAME:table.tableName,
        TRANSLATION_PARTITION_KEY: "requestId"
      }
    })

    restapi.root.addMethod("GET", new apigateway.LambdaIntegration(getTranslationSLambda))
  }
}
