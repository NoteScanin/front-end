import { AuthUI } from "@/components/ui/auth-ui";

export const metadata = {
  title: "Daftar - Scanin",
  description: "Buat akun Scanin baru dan mulai ubah catatan tulisan tanganmu menjadi dokumen PDF yang rapi.",
};

export default function SignUpPage() {
  return <AuthUI defaultMode="signup" />;
}
