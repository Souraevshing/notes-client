import { ROUTES } from "@/shared/routes";

export function useAuth() {
  async function signup(email: string, password: string) {
    const res = await fetch(ROUTES.auth.signup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  }

  async function login(email: string, password: string) {
    const res = await fetch(ROUTES.auth.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  }

  async function logout() {
    localStorage.removeItem("token");
  }

  return { signup, login, logout };
}
