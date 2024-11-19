/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";
import { fetchAuthSession } from "aws-amplify/auth";

const URL = "https://ara5o5slgh.execute-api.us-east-1.amazonaws.com/prod/";
//in case we deployed a domain name
// const URL= "https://api.domainName.com"
const translateText = async ({
  inputLang,
  inputText,
  outputLang,
}: {
  inputLang: string;
  inputText: string;
  outputLang: string;
}) => {
  try {
    const request: ITranslateRequest = {
      sourceLang: inputLang,
      targetLang: outputLang,
      sourceText: inputText,
    };

    const authToken=(await fetchAuthSession()).tokens?.idToken?.toString()

    const result = await fetch(`${URL}`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const rtnValue = (await result.json()) as ITranslateResponse;
    return rtnValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

const getTranslations = async () => {
  try {
    const authToken=(await fetchAuthSession()).tokens?.idToken?.toString()
    const result = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const rtnValue = (await result.json()) as Array<ITranslateDBObject>;
    return rtnValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

export default function Home() {
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  const [translations, setTranslations] = useState<Array<ITranslateDBObject>>(
    []
  );

  return (
    <main className="flex flex-col m-8">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await translateText({
            inputLang,
            outputLang,
            inputText,
          });
          console.log(result);
          setOutputText(result);
        }}
      >
        <div>
          <label htmlFor="inputText">Input text:</label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="inputLang">Input Language:</label>
          <input
            id="inputLang"
            type="text"
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="outputLang">Output Language:</label>
          <input
            id="outputLang"
            type="text"
            value={outputLang}
            onChange={(e) => setOutputLang(e.target.value)}
          />
        </div>

        <button className="btn bg-blue-500" type="submit">
          translate
        </button>
      </form>

      <div>
        <p>Result:</p>
        <pre style={{ whiteSpace: "pre-wrap" }} className="w-full">
          {JSON.stringify(outputText, null, 2)}
        </pre>
      </div>

      <button
        className="btn bg-blue-500"
        type="button"
        onClick={async () => {
          const rtnValue = await getTranslations();
          console.log(rtnValue)
          setTranslations(rtnValue);
        }}
      >
        getTranslations
      </button>
      <div>
        <p>Result:</p>
        <pre>
          {translations.map((item) => (
            <>
            <div key={item.requestId}>
              <p>
                {item.sourceLang}/{item.sourceText}
              </p>
              <p>
                {item.targetLang}/{item.targetText}
              </p>
            </div>
            <hr />
            </>
          ))}
        </pre>

        {/* <pre style={{ whiteSpace: "pre-wrap" }} className="w-full">
          {JSON.stringify(translations, null, 2)}
        </pre> */}
      </div>
    </main>
  );
}
