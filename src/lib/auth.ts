const ADMIN_EMAIL = "Administração2026@gmail.com";
const ADMIN_PASSWORD = "Senha@Forte.@demais!!2510";
const KEY = "topcar_admin_session";

export function login(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function isAdmin(): boolean {
  return localStorage.getItem(KEY) === "1";
}
