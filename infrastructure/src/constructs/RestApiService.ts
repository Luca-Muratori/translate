import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from 'aws-cdk-lib/aws-cognito'
//import * as route53 from 'aws-cdk-lib/aws-route53'
//import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
//import * as acm from 'aws-cdk-lib/aws-certificatemanager

export interface IRestApiServiceProps extends cdk.StackProps {
  //apiUrl: string;
  //certificate: acm.Certificate
  //zone-: route53.IHostedZone
  userPool: cognito.UserPool
}

export class RestApiService extends Construct {
  public restApi: apigateway.RestApi;
  public authorizer?: apigateway.CognitoUserPoolsAuthorizer
  constructor(
    scope: Construct,
    id: string,
    { /*apiUrl certificate, zone*/userPool }: IRestApiServiceProps
  ) {
    super(scope, id);

    this.restApi = new apigateway.RestApi(this, "timeofdayrestapi", {
      defaultCorsPreflightOptions:{
        allowOrigins:apigateway.Cors.ALL_ORIGINS,
        allowMethods:apigateway.Cors.ALL_METHODS,
        allowCredentials: true,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS
      }
    });

    if(userPool){
      this.authorizer=new apigateway.CognitoUserPoolsAuthorizer(
        this.restApi,
        "authorizer",
        {
          cognitoUserPools:[userPool],
          authorizerName: "userPoolAuthorizer"
        }
      )
    }
    /*
        in case we want to deploy an api domain
        const restapi= new apigateway.RestApi(this, 'timeofdayrestapi', {
        domainName:{
            domainName: apiUrl,
            certificate
        }
        })

        new route53.ARecord(this, "apidns", {
            zone,
            recordName: "api"
            target: route53.RecordTarget.fromAlias(
                new route53Targets.ApiGateway(this.restApi))
            })
        */
  }

  addTranslateMethod({
    httpMethod,
    lambda,
    isAuth
  }: {
    httpMethod: string;
    lambda: lambda.IFunction;
    isAuth?: boolean
  }) {
    let options: apigateway.MethodOptions={}

    if(isAuth){
      if(!this.authorizer) throw new Error('authorizer is not set')
      options={
        authorizer: this.authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO
      }
    }
    this.restApi.root.addMethod(
      httpMethod,
      new apigateway.LambdaIntegration(lambda),
      options
    );
  }
}
