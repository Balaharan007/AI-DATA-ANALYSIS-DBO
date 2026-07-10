"use client";

import { AuthModal } from "@/components/auth/AuthModal";

export function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthModal isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}
