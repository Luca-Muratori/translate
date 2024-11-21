"use client"

import { translateApi } from "@/lib"
import { ITranslateRequest } from "@sff/shared-types"
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
        }
    })

    return {
        translations: !translateQuery.data ? [] : translateQuery.data,
        isLoading: translateQuery.status === "pending",
        translate: translateMutation.mutate,
        isTranslating : translateMutation.status === "pending"
    }
}