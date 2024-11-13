import * as clientTranslate from "@aws-sdk/client-translate";
import {
    ITranslateRequest,
  } from "@sff/shared-types";
export async function  getTranslation({ sourceLang, targetLang, sourceText }: ITranslateRequest){

    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: sourceText,
    });
    
    const translateClient = new clientTranslate.TranslateClient({});
    const result = await translateClient.send(translateCmd);
    return result
}

