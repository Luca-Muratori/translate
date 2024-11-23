/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILoginFormData } from "@/lib";
import { signIn } from "aws-amplify/auth";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

export function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const {
    register,
    formState: { errors },
  } = useForm<ILoginFormData>();

  const onSubmit: SubmitHandler<ILoginFormData> = async (
    { email, password },
    event
  ) => {
    event && event.preventDefault();
    try {
      await signIn({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      onSignedIn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <form className="flex flex-col space-y-4">
      <div>
        <label htmlFor="email">E-mail:</label>
        <input
          id="email"
          type="email"
          {...register("email", { required: true })}
        />
        {errors.email && <span>field required</span>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <span>field required</span>}
      </div>

      <button className="btn bg-blue-500" type="submit">
        Login
      </button>
      <Link className="hover:underline" href="/user">
        Login
      </Link>
    </form>
  );
}
