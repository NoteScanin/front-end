"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// --- Typewriter Effect ---
export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    textArray.length,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}

// --- Label ---
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

// --- Button ---
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-gray-200",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[#333] bg-transparent text-gray-300 hover:border-white/40 hover:text-white hover:bg-white/5",
        secondary: "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-gray-400 underline-offset-4 hover:underline hover:text-white",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Input ---
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 sm:h-11 w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 sm:px-3 py-3 text-base sm:text-sm text-gray-100 shadow-sm transition-all duration-200 placeholder:text-gray-600 focus:border-white/30 focus:bg-[#111] focus:outline-none focus:ring-1 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Password Input ---
export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
      <div className="grid w-full items-center gap-2">
        {label && (
          <Label htmlFor={id} className="text-gray-300">
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            className={cn("pe-12 sm:pe-10", className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 end-0 flex h-full w-12 sm:w-10 items-center justify-center text-gray-500 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-5 sm:size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-5 sm:size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// --- Scanin Logo ---
function ScaninLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white transition-transform duration-300 group-hover:scale-105"
        style={{ filter: "drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5))" }}
      >
        <path
          d="M 6 18 C 10 18 16 6 12 6 C 8 6 6 14 10 18 C 14 22 18 12 22 12 C 24 12 26 18 30 18 C 34 18 38 12 42 10"
          stroke="url(#gradient-logo-auth)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="gradient-logo-auth"
            x1="6"
            y1="6"
            x2="42"
            y2="18"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#9ca3af" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider">
        Scanin
      </span>
    </Link>
  );
}

// --- Sign In Form ---
function SignInForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login gagal.");
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      autoComplete="on"
      className="flex flex-col gap-6 sm:gap-7"
    >
      <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Masuk ke akunmu
        </h1>
        <p className="text-balance text-xs sm:text-sm text-gray-500">
          Masukkan email kamu untuk melanjutkan
        </p>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
            autoComplete="email"
          />
        </div>
        <PasswordInput
          name="password"
          label="Password"
          required
          autoComplete="current-password"
          placeholder="Masukkan password"
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Lupa password?
          </button>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg font-semibold h-12 sm:h-11 text-base sm:text-sm"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Masuk"}
        </Button>
      </div>
    </form>
  );
}

// --- Sign Up Form ---
function SignUpForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Registrasi gagal.");
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      autoComplete="on"
      className="flex flex-col gap-6 sm:gap-7"
    >
      <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Buat akun baru
        </h1>
        <p className="text-balance text-xs sm:text-sm text-gray-500">
          Isi data di bawah untuk membuat akun Scanin
        </p>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-gray-300">
            Nama Lengkap
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            required
            autoComplete="name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email-signup" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email-signup"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
            autoComplete="email"
          />
        </div>
        <PasswordInput
          name="password"
          label="Password"
          required
          autoComplete="new-password"
          placeholder="Buat password"
          minLength={8}
        />
        <p className="text-xs text-gray-600 -mt-1">
          Minimal 8 karakter dengan kombinasi huruf dan angka
        </p>
        <Button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg font-semibold h-12 sm:h-11 text-base sm:text-sm"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Daftar"}
        </Button>
      </div>
    </form>
  );
}

// --- Auth Form Container ---
function AuthFormContainer({
  isSignIn,
  onToggle,
}: {
  isSignIn: boolean;
  onToggle: () => void;
}) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleClick = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleError("Google Client ID belum dikonfigurasi.");
      return;
    }

    // Use Google's OAuth2 popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const redirectUri = window.location.origin;
    const scope = "openid email profile";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=select_account`;
    
    const popup = window.open(authUrl, "google-auth", `width=${width},height=${height},left=${left},top=${top}`);
    
    if (!popup) {
      setGoogleError("Popup diblokir. Izinkan popup untuk login dengan Google.");
      return;
    }

    setGoogleLoading(true);
    setGoogleError("");

    // Poll for the popup redirect
    const pollTimer = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(pollTimer);
          setGoogleLoading(false);
          return;
        }
        const popupUrl = popup.location.href;
        if (popupUrl.startsWith(redirectUri)) {
          clearInterval(pollTimer);
          popup.close();
          
          // Extract access_token from URL hash
          const hash = popupUrl.split("#")[1];
          if (hash) {
            const params = new URLSearchParams(hash);
            const accessToken = params.get("access_token");
            if (accessToken) {
              const result = await loginWithGoogle(accessToken);
              setGoogleLoading(false);
              if (result.success) {
                router.push("/");
              } else {
                setGoogleError(result.error || "Google login gagal.");
              }
              return;
            }
          }
          setGoogleLoading(false);
          setGoogleError("Google login gagal. Token tidak ditemukan.");
        }
      } catch {
        // Cross-origin error — popup hasn't redirected yet, keep polling
      }
    }, 500);
  };

  return (
    <div className="mx-auto grid w-full max-w-[380px] gap-3 px-1">
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <div className="text-center text-sm text-gray-500">
        {isSignIn ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <button
          type="button"
          className="text-white hover:underline underline-offset-4 font-medium pl-1 cursor-pointer"
          onClick={onToggle}
        >
          {isSignIn ? "Daftar" : "Masuk"}
        </button>
      </div>
      <div className="relative text-center text-sm my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#222]" />
        </div>
        <span className="relative z-10 bg-[#0a0a0a] px-3 text-gray-600 text-xs uppercase tracking-wider">
          Atau lanjut dengan
        </span>
      </div>
      {googleError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {googleError}
        </div>
      )}
      <Button
        variant="outline"
        type="button"
        disabled={googleLoading}
        className="rounded-lg h-12 sm:h-11 text-base sm:text-sm"
        onClick={handleGoogleClick}
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin mr-2" />
        ) : (
          <svg className="mr-2 h-5 w-5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Lanjut dengan Google
      </Button>
    </div>
  );
}

// --- Visual Panel (Right Side) ---
interface AuthContentProps {
  quote?: {
    text: string;
    author: string;
  };
}

interface AuthUIProps {
  defaultMode?: "signin" | "signup";
  signInContent?: AuthContentProps;
  signUpContent?: AuthContentProps;
}

const defaultSignInContent = {
  quote: {
    text: "Selamat datang kembali! Lanjutkan perjalananmu.",
    author: "Scanin",
  },
};

const defaultSignUpContent = {
  quote: {
    text: "Mulai perjalanan baru. Ubah catatanmu jadi digital.",
    author: "Scanin",
  },
};

export function AuthUI({
  defaultMode = "signin",
  signInContent = {},
  signUpContent = {},
}: AuthUIProps) {
  const [isSignIn, setIsSignIn] = useState(defaultMode === "signin");
  const toggleForm = () => setIsSignIn((prev) => !prev);
  
  const [orcAngry, setOrcAngry] = useState(false);
  
  const handleOrcClick = () => {
    setOrcAngry(true);
    setTimeout(() => {
      setOrcAngry(false);
    }, 2500);
  };

  const finalSignInContent = {
    quote: { ...defaultSignInContent.quote, ...signInContent.quote },
  };
  const finalSignUpContent = {
    quote: { ...defaultSignUpContent.quote, ...signUpContent.quote },
  };

  const currentContent = isSignIn ? finalSignInContent : finalSignUpContent;

  return (
    <div className="w-full min-h-[100dvh] bg-[#0a0a0a] flex flex-col md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Left / Main: Form */}
      <div className="relative flex flex-1 flex-col min-h-[100dvh] md:min-h-0">
        {/* Top bar: Back + Logo */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-8 pb-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <ScaninLogo />
        </div>

        {/* Form area — scrollable and vertically centered */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-5 sm:px-8 py-6 sm:py-10">
          <AuthFormContainer isSignIn={isSignIn} onToggle={toggleForm} />
        </div>

        {/* Mobile-only bottom quote */}
        <div className="md:hidden shrink-0 px-5 pb-6 pt-2">
          <blockquote className="text-center">
            <p className="text-xs text-gray-600 italic">
              &ldquo;{currentContent.quote.text}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right: Visual Panel (tablet + desktop) */}
      <div className="hidden md:flex relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0d0d0d] to-[#080808]" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] bg-white/[0.015] rounded-full blur-3xl" />

        {/* Floating scan illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Orc Container */}
            <div className="relative flex items-center justify-center z-50">
              <AnimatePresence>
                {orcAngry && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      rotate: [-3, 3, -3, 3, 0],
                      x: [-2, 2, -2, 2, 0]
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 bg-white text-black font-bold px-4 py-2 md:px-5 md:py-3 rounded-xl shadow-2xl text-xs md:text-sm whitespace-nowrap z-50 pointer-events-none"
                    style={{ fontFamily: "'Press Start 2P', monospace", imageRendering: "pixelated" }}
                  >
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent"></div>
                    CEPAT LOGIN WOY!!!
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.img
                src="https://www.8bitcn.com/_next/image?url=%2Fimages%2F8bit-ogre.png&w=256&q=75&dpl=dpl_B9Q5u7DD6qZpoCz3VRwuR19npVHK"
                alt="8-bit Orc"
                width={256}
                height={256}
                className="w-32 h-32 md:w-56 md:h-56 lg:w-72 lg:h-72 object-contain cursor-pointer relative z-10"
                style={{ imageRendering: "pixelated" }}
                animate={orcAngry ? {
                  scale: [1, 1.2, 1],
                  rotate: [-10, 10, -10, 10, 0],
                  filter: ["hue-rotate(0deg)", "hue-rotate(90deg) drop-shadow(0 0 20px red)", "hue-rotate(0deg)"]
                } : {
                  y: [0, -20, 0],
                  rotate: [-3, 3, -3],
                }}
                transition={orcAngry ? {
                  duration: 0.5,
                  repeat: 4,
                } : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                onClick={handleOrcClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>

            {/* Floating dots */}
            <div className="absolute -top-4 -right-4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-3 h-3 bg-white/10 rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 -right-8 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse delay-1000" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-[#0a0a0a] to-transparent" />

        {/* Quote */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-end p-4 md:p-6 pb-8 md:pb-10 pointer-events-none">
          <blockquote className="space-y-2 text-center max-w-xs lg:max-w-sm pointer-events-auto">
            <p className="text-base lg:text-lg font-medium text-white/80">
              &ldquo;
              <Typewriter
                key={currentContent.quote.text}
                text={currentContent.quote.text}
                speed={50}
              />
              &rdquo;
            </p>
            <cite className="block text-sm font-light text-gray-600 not-italic">
              — {currentContent.quote.author}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
