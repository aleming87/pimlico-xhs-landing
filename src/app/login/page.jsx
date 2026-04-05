import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your XHS\u2122 Copilot regulatory workspace.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  redirect("https://xhsdata.ai/login");
}
