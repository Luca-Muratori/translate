/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import {
  ITranslateResult,
  ITranslateResponse,
} from "@sff/shared-types";
import { getCurrentUser } from "aws-amplify/auth";
import { useTranslate } from "@/hooks/";



export default function Home() {
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  //const [translations, setTranslations] = useState<Array<ITranslateResult>>([]);

  const {isLoading, translations, translate, isTranslating } = useTranslate()

  if(isLoading) return <p>is loading....</p>

  return (
    <main className="flex flex-col m-8">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          // eslint-disable-next-line prefer-const
          let result = await translate({
            sourceLang: inputLang,
            targetLang: outputLang,
            sourceText: inputText
          });
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

      {/* <button
        className="btn bg-blue-500"
        type="button"
        onClick={async () => {
          const rtnValue = await getUserTranslations();
          console.log(rtnValue);
          setTranslations(rtnValue);
        }}
      >
        get translations
      </button> */}
      <div className="flex flex-col space-y-2 p-1">
        {translations.map((item) => (
          <div key={item.requestId}>
            <div
              key={item.requestId}
              className="flex flex-row justify-between space-x-1 bg-slate-400"
            >
              <p>
                {item.sourceLang}/{item.sourceText}
              </p>
              <p>
                {item.targetLang}/{item.targetText}
              </p>
              {/* <button
                className="btn p-1 bg-red-500 rounded-md hover:bg-red-300"
                type="button"
                onClick={async () => {
                  const rtnValue = await deleteUserTranslation({
                    requestId: item.requestId,
                    username: item.username,
                  });
                  setTranslations(rtnValue);
                }}
              >
                X
              </button> */}
            </div>
            <hr />
          </div>
        ))}

        {/* <pre style={{ whiteSpace: "pre-wrap" }} className="w-full">
          {JSON.stringify(translations, null, 2)}
        </pre> */}
      </div>
    </main>
  );
}
