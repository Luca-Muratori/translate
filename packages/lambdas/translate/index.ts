
import * as lambda from "aws-lambda";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";
import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { gateway, getTranslation, exception} from "/opt/nodejs/utils-lambda-layer"

const { TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY } = process.env;

if (!TRANSLATION_TABLE_NAME)
  throw new exception.MissingEnvironmentVariable("TRANSLATION_TABLE_NAME is undefined");
if (!TRANSLATION_PARTITION_KEY)
  throw new exception.MissingEnvironmentVariable("TRANSLATION_PARTITION_KEY is undefined");

// const translateClient = new clientTranslate.TranslateClient({});
const dynamodbClient = new dynamodb.DynamoDBClient({});

export const translate = async function (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) {
  try {
    if (!event.body) {
      throw new exception.MissingBodyData();
    }

    const body = JSON.parse(event.body) as ITranslateRequest;

    if (!body.sourceLang) {
      throw new exception.MissingParameters('sourceLang')
    }
    if (!body.targetLang) {
      throw new exception.MissingParameters('targetLang')
    }
    if (!body.sourceText) {
      throw new exception.MissingParameters('sourceText')
    }
    const { sourceLang, targetLang, sourceText } = body;


    const now = new Date(Date.now()).toString();

    const result = await getTranslation(body)

    if (!result.TranslatedText) {
      throw new exception.MissingParameters('translationtext')
    }

    const rtnData: ITranslateResponse = {
      timestamp: now,
      targetText: result.TranslatedText,
    };

    //save translation in the db
    const tableObj: ITranslateDBObject = {
      ...body,
      ...rtnData,
      //in order to have an unique id we can get the request id from the context object
      requestId: context.awsRequestId,
    };

    //insert the object in the dynamod table
    const tableInsetCmd: dynamodb.PutItemCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
      Item: marshall(tableObj),
    };

    await dynamodbClient.send(new dynamodb.PutItemCommand(tableInsetCmd));

    return gateway.createSuccessJsonRsponse(rtnData)
  } catch (e: any) {
    console.error(e);
    return gateway.createErrorJsonRsponse(e)
  }
};

export const getTranslations = async function (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) {
  try {
    //insert the object in the dynamod table
    const scanCmd: dynamodb.ScanCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
    };

    const { Items } = await dynamodbClient.send(
      new dynamodb.ScanCommand(scanCmd)
    );

    if (!Items) {
      throw new exception.MissingParameters('Items')
    }

    const rtnData = Items.map((item) => unmarshall(item) as ITranslateDBObject);

    return gateway.createSuccessJsonRsponse(rtnData)
  } catch (e: any) {
    console.error(e);
    return gateway.createErrorJsonRsponse(e)
  }
};
