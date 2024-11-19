'use client'
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth:{
    Cognito:{
      userPoolId:'us-east-1_7HSuWWEMI',
      userPoolClientId:'14dhg6voi0mqqnp6us57550m3d'
    }
  }
}, {
  ssr: true
} )

export function ConfigureAmplify(){
    return null
}