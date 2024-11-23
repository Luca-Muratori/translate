/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import {
  confirmSignUp,
  autoSignIn,
} from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { ISignInState, ISignUpState } from "@/lib";
import { ConfirmSignup, RegistrationForm } from "@/components";

function AutoSignIn({
  onStepChange,
}: {
  onStepChange: (step: ISignInState) => void;
}) {
  useEffect(() => {
    const asyncSignIn = async () => {
      const { nextStep } = await autoSignIn();
      console.log(nextStep);
      onStepChange(nextStep);
    };

    asyncSignIn();
  }, []);

  return <div>signing in...</div>;
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<ISignInState | ISignUpState | null>(null);

  useEffect(() => {
    if (!step) {
      return;
    }
    if ((step as ISignInState).signInStep === "DONE") {
      router.push("/");
    }
  }, [step]);

  if (step) {
    if ((step as ISignUpState).signUpStep === "CONFIRM_SIGN_UP") {
      return <ConfirmSignup onStepChange={setStep} />;
    }
    if ((step as ISignUpState).signUpStep === "COMPLETE_AUTO_SIGN_IN") {
      return <AutoSignIn onStepChange={setStep} />;
    }
  }

  return <RegistrationForm onStepChange={setStep} />;
}
