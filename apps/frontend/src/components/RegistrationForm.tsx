/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRegisterFormData, ISignUpState } from "@/lib";
import { signUp } from "aws-amplify/auth";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

export function RegistrationForm({
  }: {
    onStepChange: (step: ISignUpState) => void;
  }) {
    const {register, handleSubmit, formState:{errors}}=useForm<IRegisterFormData>()

    const onSubmit: SubmitHandler<IRegisterFormData>=async ({
        email,
        password,
        password2
    }, event)=>{
        event && event.preventDefault()
        try {
            if (password !== password2) {
              throw new Error("password don't match");
            }
  
            const { nextStep } = await signUp({
              username: email,
              password: password,
              options: {
                userAttributes: {
                  email,
                },
                autoSignIn: true,
              },
            });
          } catch (e: any) {
            console.error(e)
          }
    }
    return (
      <form
        className="flex flex-col space-y-4"
        
      >
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            {...register("email", {required: true})}
          />
          {errors.email && <span>field required</span>}
        </div>
  
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...register("password", {required: true})}
          />
          {errors.password && <span>field required</span>}
        </div>
  
        <div>
          <label htmlFor="password2">Retype Password:</label>
          <input
            id="password2"
            type="password"
            {...register("password2", {required: true})}
          />
          {errors.password2 && <span>field required</span>}
        </div>
  
        <button className="btn bg-blue-500" type="submit">
         register
        </button>
        <Link className="hover:underline" href="/user">
          Login
        </Link>
      
      </form>
    );
  }