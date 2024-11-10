"use client";

import { useState } from "react";

const URL =
  "https://huveuucaz7.execute-api.eu-central-1.amazonaws.com/prod/";
async function translateText({
  inputLanguage,
  outputLanguage,
  inputText,
}: {
  inputLanguage: string;
  outputLanguage: string;
  inputText: string;
}) {
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      sourceLang: inputLanguage,
      targetLang: outputLanguage,
      text: inputText,
    }),
  })
    .then((result) => result.json())
    .catch((e) => e.toString());
}
export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [inputLanguage, setInputLanguage] = useState<string>("");
  const [outputLanguage, setOutputLanguage] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <form action="" onSubmit={async e=>{
        e.preventDefault()
        const result =await translateText({inputText, inputLanguage, outputLanguage})
        setOutputText(result)
      }}>
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
          <label htmlFor="outputLanguage">input language</label>
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

      <p>{JSON.stringify(outputText)}</p>
    </main>
  );
}
