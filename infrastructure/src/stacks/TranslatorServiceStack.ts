import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
//transpile ts into js
import {
  RestApiService,
  TranslationService,
  StaticWebsiteDeployment,
  UserAuthSupportService,
} from "../constructs";
//import * as acm from 'aws-cdk-lib/aws-certificatemanager

export class TranslatorServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //here the code for route 53 deployment, I didn't use it since I want to keep this project as much low cost as possible
    //first go to namecheap.com to register a domain then create a route 53 on aws
    /*
    const domain="domain.com"
    const fullUrl=`www.${domain}`
    //in case we want to create a api domain
    const apiUrl=`api.${domain}`

    

    const restApi=new RestApiService(this, "restApiService",{
      apiUrl,
      certificate: certWrapper.certificate,
      zone: certWrapper.domain
    })*/

    const userAuth = new UserAuthSupportService(this, "userAuthSupport");

    const restApi = new RestApiService(this, "restApiService", {
      userPool: userAuth.userPool,
    });

    new TranslationService(this, "translationService", {
      restApi,
    });

    /*
    const certWrapper=new CertificateWrapper(this, "certificateWrapper", {
      domain, apiUrl, fullUrl
    })
    */

    new StaticWebsiteDeployment(
      this,
      "staticWebsiteDeployment" /*,{
      certificate: certWrapper.certificate,
      domain,
      fullUrl,
      zone: certWrapper.domain
      }*/
    );
  }
}
