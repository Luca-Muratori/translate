import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as path from "path"
import { RestApiService } from "./RestApiService";
import { lambdasDirPath, lambdaLayersDirPath, createNodejsLambda } from "../helpers";
//import * as route53 from 'aws-cdk-lib/aws-route53'
//import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
//import * as acm from 'aws-cdk-lib/aws-certificatemanager

export interface ITranslationServiceProps extends cdk.StackProps {
  restApi: RestApiService
  //certificate: acm.Certificate
  //zone-: route53.IHostedZone
}

export class TranslationService extends Construct {
  public restApi: apigateway.RestApi;
  constructor(
    scope: Construct,
    id: string,
    { restApi }: ITranslationServiceProps
  ) {
    super(scope, id);

    //api top level construct
 

    const utilsLambdaLayerPath = path.resolve(
      path.join(lambdaLayersDirPath, "utils-lambda-layer")
    );

    const table = new dynamodb.Table(this, "translation", {
      tableName: "translation",
      partitionKey: {
        name: "username",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //policy attahced to lambda allowing access to the tralsate resource
    const translateServicePolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    const translateTablePolicy = new iam.PolicyStatement({
      actions: [
        "dynamodb:PutItem",
        "dynamodb:scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
      ],
      resources: ["*"],
    });

    const environment= {
      TRANSLATION_TABLE_NAME: table.tableName,
      TRANSLATION_PARTITION_KEY: "username",
      TRANSLATION_SORT_KEY: "requestId",
    }

    const utilsLambdaLayer = new lambda.LayerVersion(this, "utilsLambdaLayer", {
      code: lambda.Code.fromAsset(utilsLambdaLayerPath),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const translateLambda = createNodejsLambda(
      this,
      "translateLambda",
      {
        //where the code for the function is located in this project
        lambdaRelPath: "translate/index.ts",
        //handler: name of the function
        handlerName: "userTranslate",
        initialPolicy: [translateServicePolicy, translateTablePolicy],
        layers: [utilsLambdaLayer],
        environment,
      }
    );
    
    // restapi.root.addMethod("POST", new apigateway.LambdaIntegration(translateLambda))
    restApi.addTranslateMethod({
      resource:restApi.userResource,
      httpMethod: "POST",
      lambda: translateLambda,
      isAuth: true,
    });

    //get translation lambda
    const getTranslationsLambda = createNodejsLambda(
      this,
      "getUserTranslations",
      {
        //where the code for the function is located in this project
        lambdaRelPath: "translate/index.ts",
        //handler: name of the function
        handlerName: "getUserTranslations",
        initialPolicy: [translateTablePolicy],
        layers: [utilsLambdaLayer],
        environment,
      }
    );

    restApi.addTranslateMethod({
      resource:restApi.userResource,
      httpMethod: "GET",
      lambda: getTranslationsLambda,
      isAuth: true
    });
    
    //get translation lambda
    const userDeleteTranslateLambda = createNodejsLambda(
      this,
      "userDeleteTranslateLambda",
      {
        //where the code for the function is located in this project
        lambdaRelPath: "translate/index.ts",
        //handler: name of the function
        handlerName: "deleteUserTranslation",
        initialPolicy: [translateTablePolicy],
        layers: [utilsLambdaLayer],
        environment,
      }
    );

    restApi.addTranslateMethod({
      resource:restApi.userResource,
      httpMethod: "DELETE",
      lambda: userDeleteTranslateLambda,
      isAuth: true
    });
    //get translation lambda
    const publicTranslateLambda = createNodejsLambda(
      this,
      "publicTranslateLambda",
      {
        //where the code for the function is located in this project
        lambdaRelPath: "translate/index.ts",
        //handler: name of the function
        handlerName: "publicTranslate",
        initialPolicy: [translateServicePolicy],
        layers: [utilsLambdaLayer],
        environment,
      }
    );

    restApi.addTranslateMethod({
      resource:restApi.publicResource,
      httpMethod: "POST",
      lambda: publicTranslateLambda,
      isAuth: false
    });
  }
}
