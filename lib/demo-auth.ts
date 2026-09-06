export type DemoAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "PLANNER" | "PROVIDER";
};

export const DEMO_ACCOUNTS_KEY = "legacycare-demo-accounts";

export const builtInDemoAccounts: DemoAccount[] = [
  { id: "demo-admin", name: "LegacyCare Admin", email: "admin@legacycare.app", password: "password123", role: "PLANNER" },
  { id: "demo-planner", name: "Sarah Mitchell", email: "planner@legacycare.app", password: "password123", role: "PLANNER" },
  { id: "demo-provider", name: "Eternal Peace Services", email: "provider@legacycare.app", password: "password123", role: "PROVIDER" },
];

export function normalizeDemoEmail(email: string) {
  return email.trim().toLowerCase();
}

export function readLocalDemoAccounts(): DemoAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(DEMO_ACCOUNTS_KEY);
    return stored ? (JSON.parse(stored) as DemoAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalDemoAccount(account: DemoAccount) {
  const accounts = readLocalDemoAccounts().filter(
    (item) => normalizeDemoEmail(item.email) !== normalizeDemoEmail(account.email)
  );
  window.localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
}

export function findDemoAccount(email: string, password: string) {
  const normalizedEmail = normalizeDemoEmail(email);
  return [...builtInDemoAccounts, ...readLocalDemoAccounts()].find(
    (account) => normalizeDemoEmail(account.email) === normalizedEmail && account.password === password
  );
}

export function findLocalDemoAccount(email: string, password: string) {
  const normalizedEmail = normalizeDemoEmail(email);
  return readLocalDemoAccounts().find(
    (account) => normalizeDemoEmail(account.email) === normalizedEmail && account.password === password
  );
}
