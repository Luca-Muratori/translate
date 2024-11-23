/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import {
  ITranslateResult,
  ITranslateResponse,
} from "@sff/shared-types";
import { getCurrentUser } from "aws-amplify/auth";
import { useTranslate } from "@/hooks/";
import { deleteUserTranslation } from "@/lib/translateApi";
import { TranslateRequestForm } from "@/components";



export default function Home() {

  // const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  //const [translations, setTranslations] = useState<Array<ITranslateResult>>([]);

  const {isLoading, translations, deleteTranslation, isDeleting } = useTranslate()

  if(isLoading) return <p>is loading....</p>

  return (
    <main className="flex flex-col m-8">
      <TranslateRequestForm/>
     
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
              <button
                className="btn p-1 bg-red-500 rounded-md hover:bg-red-300"
                type="button"
                onClick={async () => {
                  const rtnValue = deleteTranslation(item);
                }}
              >
               {isDeleting ? "..." : "X"} 
              </button>
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
