# translate
aws project to create a translate text

with this project I want to create an SPA, where users can login and translate an input from different languages (english, spanish, etc..).
For the FE, I'll use Nextjs, for the BE I'll use .... ,for CDK I'll use typescript as IaC, and SDK to communicate with the services.

in CDK a stack is a collection of aws resources
command in CDK:
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

/bin
every project need to have the app variable
/*const app= new cdk.App()*/
that will get passed in the stack itself
new TempCdkStackStack

WHAT THIS CODE DO?
this will declare a new class called 'cdkstack' that will inherits from the aws cdk stack
export class CdkStack extends cdk.Stack {
-----
then the constructor will take three parameters:
-scope, parent constructor
-id, unique id for the stack
-props, optional stack props
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
---------
then the super will call back the parent class's constructor with the provided params
    super(scope, id, props);

  }
}

------
when deploying, cdk will create a folder called cdk.out, that will contains a file called stackname.template.json, with all the resources that we are creating

--------
in the test folder, it will be possible to rn tests
-----

for the translation I'm going to use an sdk from aws called client translate

----------
I want to use monorepo, in order to have everything in an unique directory, so I don't have to open different terminal ti run both be and fe, and for this project I'm using npm to crete a monorepo 

----
to have a general folder that contains all the types, for both be and fe, I created a package folder that will contains both types for the translate api, and in translate.d.ts will contains the encapsulation for the translate api 
-----

as db we are using dynamo db

----
in order to keep the code as organized and modularized as possible I'll use Lambda Layers

