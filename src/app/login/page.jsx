import { redirect } from "next/navigation";

export const metadata = {
  title: "Log in - XHS\u2122 Copilot",
  description: "Log in to your XHS\u2122 Copilot account.",
};

export default function LoginPage() {
  redirect("https://xhsdata.ai/login");
}
