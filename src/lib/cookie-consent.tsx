import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConsentStatus = "accepted" | "declined" | "unknown";

const COOKIE_NAME = "vidik.cookie-consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

function readConsentCookie(): ConsentStatus {
  if (typeof document === "undefined") return "unknown";
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const value = match?.slice(COOKIE_NAME.length + 1);
  return value === "accepted" || value === "declined" ? value : "unknown";
}

function writeConsentCookie(status: Exclude<ConsentStatus, "unknown">) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${status}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
}

type ConsentValue = {
  status: ConsentStatus;
  /** True while the banner should be visible. */
  isPromptOpen: boolean;
  accept: () => void;
  decline: () => void;
  /** Reopens the banner so the visitor can change their answer. */
  reopen: () => void;
};

const ConsentContext = createContext<ConsentValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>("unknown");
  const [hydrated, setHydrated] = useState(false);
  const [forcedOpen, setForcedOpen] = useState(false);

  useEffect(() => {
    setStatus(readConsentCookie());
    setHydrated(true);
  }, []);

  const set = useCallback((next: Exclude<ConsentStatus, "unknown">) => {
    try {
      writeConsentCookie(next);
    } catch {
      // Cookies can be blocked; the choice still applies for this session.
    }
    setStatus(next);
    setForcedOpen(false);
  }, []);

  const value = useMemo<ConsentValue>(
    () => ({
      status,
      isPromptOpen: hydrated && (forcedOpen || status === "unknown"),
      accept: () => set("accepted"),
      decline: () => set("declined"),
      reopen: () => setForcedOpen(true),
    }),
    [status, hydrated, forcedOpen, set],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

/**
 * Consent state for the banner and for any future non-essential script
 * (analytics, embeds) that must stay off until the visitor accepts.
 */
export function useCookieConsent(): ConsentValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used inside <CookieConsentProvider>");
  return ctx;
}
