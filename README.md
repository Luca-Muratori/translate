# translate
aws project to create a translate text

with this project I want to create an SPA, where users can login and translate an input from different languages (english, spanish, etc..).
For the FE, I'll use Nextjs, for the BE I'll use .... ,for CDK I'll use typescript as IaC, and SDK to communicate with the services.


for the translation I'm going to use an sdk from aws called client translate

----------
I want to use monorepo, in order to have everything in an unique directory, so I don't have to open different terminal ti run both be and fe, and for this project I'm using npm to crete a monorepo 

----
to have a general folder that contains all the types, for both be and fe, I created a package folder that will contains both types for the translate api, and in translate.d.ts will contains the encapsulation for the translate api 
-----

as db we are using dynamo db

----
in order to keep the code as organized and modularized as possible I'll use Lambda Layers
--------
using s3 bucket to store the html
------
cdn link https://d350lnyr8ittwk.cloudfront.net

