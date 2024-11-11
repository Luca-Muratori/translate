import * as clientTranslate from "@aws-sdk/client-translate";
import * as lambda from "aws-lambda";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";
import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const { TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY } = process.env;

if (!TRANSLATION_TABLE_NAME)
  throw new Error("TRANSLATION_TABLE_NAME is undefined");
if (!TRANSLATION_PARTITION_KEY)
  throw new Error("TRANSLATION_PARTITION_KEY is undefined");

const translateClient = new clientTranslate.TranslateClient({});
const dynamodbClient = new dynamodb.DynamoDBClient({});

export const translate = async function (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) {
  try {
    if (!event.body) {
      throw new Error("body not a string");
    }

    const body = JSON.parse(event.body) as ITranslateRequest;
    const { sourceLang, targetLang, sourceText } = body;

    const now = new Date(Date.now()).toString();
    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: sourceText,
    });
    const result = await translateClient.send(translateCmd);

    if (!result.TranslatedText) {
      throw new Error("translated text is not a string");
    }

    const rtnDate: ITranslateResponse = {
      timestamp: now,
      targetText: result.TranslatedText,
    };

    //save translation in the db
    const tableObj: ITranslateDBObject = {
      ...body,
      ...rtnDate,
      //in order to have an unique id we can get the request id from the context object
      requestId: context.awsRequestId,
    };

    //insert the object in the dynamod table
    const tableInsetCmd: dynamodb.PutItemCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
      Item: marshall(tableObj),
    };

    await dynamodbClient.send(new dynamodb.PutItemCommand(tableInsetCmd));

    return {
      statusCode: 200,
      body: JSON.stringify(rtnDate),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  } catch (e: any) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e.toString()),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
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

    if (!Items) throw new Error("no items found");

    const rtnData = Items.map((item) => unmarshall(item) as ITranslateDBObject);

    return {
      statusCode: 200,
      body: JSON.stringify(rtnData),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  } catch (e: any) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e.toString()),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }
};
