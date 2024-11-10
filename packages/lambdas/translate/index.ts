import * as clientTranslate from '@aws-sdk/client-translate'
import * as lambda from 'aws-lambda'
import {ITranslateRequest, ITranslateResponse} from "@sff/shared-types"

const translateClient=new clientTranslate.TranslateClient({})
export const index= async function (
    event: lambda.APIGatewayProxyEvent
){
    
    try {
        if(!event.body){
            throw new Error("body not a string")
        }

        const body= JSON.parse(event.body) as ITranslateRequest
        const {sourceLang, targetLang, sourceText}=body

        const now=new Date(Date.now()).toString()
        const translateCmd=new clientTranslate.TranslateTextCommand({
            SourceLanguageCode:sourceLang,
            TargetLanguageCode:targetLang,
            Text:sourceText
        })
        const result=await translateClient.send(translateCmd)
        
        if(!result.TranslatedText){
            throw new Error("translated text is not a string")
        }

        const rtnDate :ITranslateResponse={
            timestamp:now,
            targetText: result.TranslatedText
        }
        return {
            statusCode:200,
            body:  JSON.stringify(rtnDate),
            headers:{
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Credentials":"true",
                "Access-Control-Allow-Headers":"*",
                "Access-Control-Allow-Methods":"*"
            }
        }
    } catch (e:any) {
        console.error(e)
        return{
            statusCode:500,
            body: JSON.stringify(e.toString()),
            headers:{
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Credentials":"true",
                "Access-Control-Allow-Headers":"*",
                "Access-Control-Allow-Methods":"*"
            }
        }
    }
}