"use client";

import { useState } from "react";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";

const URL = "https://huveuucaz7.execute-api.eu-central-1.amazonaws.com/prod/";
export const translateText = async ({
  inputLanguage,
  outputLanguage,
  inputText,
}: {
  inputLanguage: string;
  outputLanguage: string;
  inputText: string;
}) => {
  try {
    const request: ITranslateRequest = {
      sourceLang: inputLanguage,
      targetLang: outputLanguage,
      sourceText: inputText,
    };

    const result = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const rtnValue = (await result.json()) as ITranslateResponse;
    return rtnValue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const getTranslations = async () => {
  try {
    const result = await fetch(URL, {
      method: "GET",
    });

    const rtnValue = (await result.json()) as Array<ITranslateDBObject>;
    console.log(rtnValue);
    return rtnValue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [inputLanguage, setInputLanguage] = useState<string>("");
  const [outputLanguage, setOutputLanguage] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  const [translations, setTranslations] = useState<Array<ITranslateDBObject>>(
    []
  );
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <form
        action=""
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await translateText({
            inputText,
            inputLanguage,
            outputLanguage,
          });
          setOutputText(result);
        }}
      >
        <div>
          <label htmlFor="inputText">input text</label>
          <textarea
            name=""
            id="inputText"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="inputLanguage">input language</label>
          <textarea
            name=""
            id="inputLanguage"
            value={inputLanguage}
            onChange={(event) => setInputLanguage(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="outputLanguage">output language</label>
          <textarea
            name=""
            id="outputLanguage"
            value={outputLanguage}
            onChange={(event) => setOutputLanguage(event.target.value)}
          />
        </div>
        <button className="btn bg-blue-500 p-2 mt-2 rounded-xl" type="submit">
          Translate
        </button>
      </form>

      <p>{JSON.stringify(outputText, null, 2)}</p>
      <button
        className="btn bg-blue-500"
        type="button"
        onClick={async () => {
          const data = await getTranslations();
          setTranslations(data)
        }}
      >
        Get all translate
      </button>
     
        {translations.map((item)=>(
          <div key={item.requestId}>
            <p>
              {item.sourceLang}/{item.sourceText}
            </p>
            <p>{item.targetLang}/{item.targetText}</p>
          </div>
        ))}
    
    </main>
  );
}
