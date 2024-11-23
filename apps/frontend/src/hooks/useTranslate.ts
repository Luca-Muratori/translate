"use client"
import { translateApi } from "@/lib"
import { ITranslatePrimaryKey, ITranslateRequest } from "@sff/shared-types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AuthUser, getCurrentUser } from "aws-amplify/auth"
import { useEffect, useState } from "react"

export const useTranslate=()=>{
    const [user, setUser] = useState<AuthUser| null | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const queryClient= useQueryClient()
    const queryKey=["translate", user ? user.userId: ""]

    useEffect(() => {
        async function fetchUser() {
          try {
            const currUser = await getCurrentUser();
            setUser(currUser);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            setUser(null);
          }
        }
    
        fetchUser();
      }, []);

    const translateQuery = useQuery({
        queryKey,
        queryFn:()=>{
            if(!user) return []
            return translateApi.getUserTranslations()
        }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const translateMutation = useMutation({
        mutationFn:async (request: ITranslateRequest)=>{
            if(user){
                return translateApi.translateUserText(request)
            } else {
                return translateApi.translateUserText(request);
           }
        },

        onSuccess: (result)=>{
          if(translateQuery.data){
            queryClient.setQueryData(
              queryKey,
              translateQuery.data?.concat([result])
            )
          }
        }
    })

    const deleteMutation=useMutation({
      mutationFn:async (key: ITranslatePrimaryKey)=>{
          if(!user){
              throw new Error('user not logged in')
          } 
              return translateApi.deleteUserTranslation(key);
      },

      onSuccess: (result)=>{
        if(!translateQuery.data){
          return
        }
        const index = translateQuery.data.findIndex((tItem)=> tItem.requestId === result.requestId)
        const copyData = [...translateQuery.data]
        copyData.splice(index, 1)
        queryClient.setQueryData(queryKey, copyData)
      }
  })

    return {
        translations: !translateQuery.data ? [] : translateQuery.data,
        isLoading: translateQuery.status === "pending",
        translate: translateMutation.mutate,
        isTranslating : translateMutation.status === "pending",
        deleteTranslation: deleteMutation.mutate,
        isDeleting: deleteMutation.status === "pending"
    }
}