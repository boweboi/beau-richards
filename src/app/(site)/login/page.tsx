import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In | TradieMatch",
  description:
    "Log in to your TradieMatch account to post a job, browse local trade work, or manage your profile.",
};

export default function LoginPage() {
  return <LoginForm />;
}
