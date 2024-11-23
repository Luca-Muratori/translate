/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useTranslate } from '@/hooks'
import { ITranslateRequest } from '@sff/shared-types'
import React from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'

export const TranslateRequestForm=()=>{
    
    const {register, handleSubmit, formState:{errors}}=useForm<ITranslateRequest>()

    const {translate, isTranslating,  } = useTranslate()

    const onSubmit: SubmitHandler<ITranslateRequest>=(data, event)=>{
        event && event.preventDefault()
        translate(data)
    }
    
    return (
        <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label htmlFor="inputText">Input text:</label>
          <textarea
            id="inputText"
            {...register("sourceText", {required: true})}
            rows={3}
          />
          {errors.sourceText && <span>text to be translated required</span>}
        </div>

        <div>
          <label htmlFor="inputLang">Input Language:</label>
          <input
            id="sourceLang"
            type="text"
            {...register("sourceLang", {required: true})}
          />
          {errors.sourceLang && <span>original language required</span>}
        </div>

        <div>
          <label htmlFor="targetLang">Output Language:</label>
          <input
            id="targetLang"
            type="text"
            {...register("targetLang", {required: true})}
          />
          {errors.targetLang && <span>translated language required</span>}
        </div>

        <button className="btn bg-blue-500" type="submit">
          {isTranslating ? "translating..." : "translate"}
        </button>
      </form>
    )
}