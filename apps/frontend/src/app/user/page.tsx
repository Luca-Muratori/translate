"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
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
      }}
    >
      <div>
        <label htmlFor="email">E-mail:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn bg-blue-500" type="submit">
        Login
      </button>

      <Link className="hover:underline" href="/register">
        Register
      </Link>
    </form>
  );
}

function Logout({ onSignedOut }: { onSignedOut: () => void }) {
  return (
    <div className="flex w-full">
      <button
        className="btn bg-blue-500 w-full"
        onClick={async () => {
          await signOut();
          onSignedOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default function User() {
  const [user, setUser] = useState<object | null | undefined>(undefined);

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

  if (user === undefined) {
    return <p>loading...</p>;
  }

  if (user) {
    return (
      <Logout
        onSignedOut={() => {
          setUser(null);
        }}
      />
    );
  }

  return (
    <Login
      onSignedIn={async () => {
        const currUser = await getCurrentUser();
        setUser(currUser);
      }}
    />
  );
}
