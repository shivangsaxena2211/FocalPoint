import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  name: string;
  email: string;
}

interface StoredUser {
  name: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const USERS_KEY = "lum_users";
const SESSION_KEY = "lum_session";

const AuthContext = createContext<AuthContextValue | null>(null);

function getUsers(): Record<string, StoredUser> {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user: User, remember: boolean) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSessionFromStorage(): User | null {
  const ls = localStorage.getItem(SESSION_KEY);
  const ss = sessionStorage.getItem(SESSION_KEY);
  if (ls) return JSON.parse(ls) as User;
  if (ss) return JSON.parse(ss) as User;
  return null;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getSessionFromStorage());

  useEffect(() => {
    setUser(getSessionFromStorage());
  }, []);

  const login = useCallback((email: string, password: string, remember: boolean) => {
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      return "Please enter a valid email.";
    }

    const users = getUsers();
    if (!users[normalizedEmail] || users[normalizedEmail].password !== btoa(password)) {
      return "Incorrect email or password.";
    }

    const nextUser: User = { name: users[normalizedEmail].name, email: normalizedEmail };
    setSession(nextUser, remember);
    setUser(nextUser);
    return null;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) return "Name is required.";
    if (!isValidEmail(normalizedEmail)) return "Please enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";

    const users = getUsers();
    if (users[normalizedEmail]) return "This email is already registered.";

    users[normalizedEmail] = { name: normalizedName, password: btoa(password) };
    saveUsers(users);

    const nextUser: User = { name: normalizedName, email: normalizedEmail };
    setSession(nextUser, true);
    setUser(nextUser);
    return null;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
