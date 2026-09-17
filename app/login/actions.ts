"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  AUTH_VALUE,
  DEFAULT_LOGIN,
  DEFAULT_PASSWORD,
} from "@/lib/auth";

export async function login(formData: FormData) {
  const loginValue = (formData.get("login") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (loginValue === DEFAULT_LOGIN && password === DEFAULT_PASSWORD) {
    cookies().set(AUTH_COOKIE, AUTH_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin");
  }

  redirect("/login?error=1");
}
