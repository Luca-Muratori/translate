import * as iam from "aws-cdk-lib/aws-iam";
import * as fs from "fs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdanodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");
import { lambdasDirPath } from "./appPaths";

const bundling: lambdanodejs.BundlingOptions = {
  minify: true,
  externalModules: ["/opt/nodejs/utils-lambda-layer"],
};

export const createNodejsLambda = (
  scope: Construct,
  lambdaName: string,
  {
    lambdaRelPath,
    handlerName,
    initialPolicy,
    layers,
    environment,
  }: {
    lambdaRelPath: string;
    handlerName: string;
    initialPolicy: Array<iam.PolicyStatement>;
    layers: Array<lambda.ILayerVersion>;
    environment: Record<string, string>;
  }
) => {
  const lambdaPath = path.join(lambdasDirPath, lambdaRelPath);
  if (!fs.existsSync(lambdaPath)) {
    throw new Error("lambdapath doesn't exist");
  }
  return new lambdanodejs.NodejsFunction(scope, lambdaName, {
    //where the code for the function is located in this project
    entry: lambdaPath,
    //handler: name of the functionp
    handler: handlerName,
    runtime: lambda.Runtime.NODEJS_20_X,
    initialPolicy: initialPolicy,
    layers: layers,
    environment: environment,
    bundling: bundling,
  });
};
