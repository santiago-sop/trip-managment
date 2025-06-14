'use client';
import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
