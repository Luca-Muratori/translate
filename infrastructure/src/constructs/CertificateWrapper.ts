import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'

export interface ICertificateWrapperProps extends cdk.StackProps {
  //domain: string;
  //fullUrl: string;
  //apiUrl: string
}

export class CertificateWrapper extends Construct {
  public zone: route53.IHostedZone;
  public certificate: acm.Certificate
  constructor(
    scope: Construct,
    id: string,
    //{ /*domain, fullUrl, apiUrl*/ }: ICertificateWrapperProps
  ) {
    super(scope, id);
    //bucket where website dist will be stored
   /*
   this.zone=route53.HostedZone.fromLookup(this, "zone", {
      domainName:domain
    })

    //https
    this.certificate = new acm.Certificate(this, "certificate", {
      domainName: domain,
      subjectAlternativeNames: [fullUrl, apiUrl]
      validation: acm.CertificateValidation.fromDns(this.zone)
    })
   */
  }


}
