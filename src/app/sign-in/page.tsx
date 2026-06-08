import { AuthUI } from "@/components/ui/auth-ui";

export const metadata = {
  title: "Masuk - Scanin",
  description: "Masuk ke akun Scanin kamu untuk mulai mengubah catatan tulisan tangan menjadi PDF rapi.",
};

export default function SignInPage() {
  return <AuthUI defaultMode="signin" />;
}
