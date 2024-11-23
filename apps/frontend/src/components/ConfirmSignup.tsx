/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRegisterConfirmation, ISignUpState } from "@/lib";
import { confirmSignUp, signUp } from "aws-amplify/auth";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

export function ConfirmSignup({
  }: {
    onStepChange: (step: ISignUpState) => void;
  }) {
    const {register, handleSubmit, formState:{errors}}=useForm<IRegisterConfirmation>()

    const onSubmit: SubmitHandler<IRegisterConfirmation>=async ({
        email,
        verificationCode
    }, event)=>{
        event && event.preventDefault()
        try {
          const { nextStep } = await confirmSignUp({
            confirmationCode: verificationCode,
            username: email,
          });

          console.log(nextStep.signUpStep);
        } catch (e) {}
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
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            id="password"
            type="string"
            {...register("verificationCode", {required: true})}
          />
          {errors.verificationCode && <span>field required</span>}
        </div>
  
       
        <button className="btn bg-blue-500" type="submit">
         confirm
        </button>
        <Link className="hover:underline" href="/user">
          Login
        </Link>
      
      </form>
    );
  }