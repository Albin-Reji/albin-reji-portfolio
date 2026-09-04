import dns from "node:dns";

// Configure reliable DNS servers for Node DNS resolver
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in environments where setServers is restricted
}

export interface EmailVerificationResult {
  valid: boolean;
  email: string;
  domain?: string;
  reason?:
    | "invalid_format"
    | "invalid_username"
    | "disposable"
    | "domain_not_found"
    | "no_mx_records"
    | "typo"
    | "valid";
  suggestion?: string | null;
  error?: string | null;
}

// ── Known major email domains ────────────────────────────────────────────────
const MAJOR_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "zoho.com",
  "yandex.com",
  "mail.com",
  "gmx.com",
];

// Common mistyped TLDs for major providers (e.g. gmail.cm, yahoo.co)
const TYPO_TLDS = new Set([
  "cm",
  "co",
  "con",
  "comm",
  "cmo",
  "cpm",
  "om",
  "col",
  "vom",
  "conm",
  "coom",
  "ocm",
  "come",
  "xom",
  "c0m",
  "cpm",
]);

// ── Direct typo mappings ──────────────────────────────────────────────────────
const DOMAIN_TYPOS: Record<string, string> = {
  // Gmail typos
  "gmai.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmaik.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.comm": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmail.cpm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmeil.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaul.com": "gmail.com",
  "gmai.co": "gmail.com",
  "gmai.cm": "gmail.com",
  "gmaill.co": "gmail.com",
  "gmaill.cm": "gmail.com",
  "gmaill.con": "gmail.com",
  "googlemail.cm": "googlemail.com",
  "googlemail.con": "googlemail.com",
  "googlemail.co": "googlemail.com",

  // Yahoo typos
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhaoo.com": "yahoo.com",
  "yahoou.com": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yaho.co": "yahoo.com",
  "yaho.cm": "yahoo.com",

  // Hotmail / Outlook typos
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmale.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "otlook.com": "outlook.com",
  "outlook.cm": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.con": "outlook.com",

  // iCloud typos
  "iclud.com": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.cm": "icloud.com",
  "icloud.co": "icloud.com",
  "icloud.con": "icloud.com",

  // Proton typos
  "prton.me": "proton.me",
  "prtonmail.com": "protonmail.com",
  "protonmai.com": "protonmail.com",
};

// ── Disposable / burner email domains ─────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "sharklasers.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.net",
  "throwawaymail.com",
  "getnada.com",
  "dispostable.com",
  "burnermail.io",
  "fakeinbox.com",
  "mohmal.com",
  "inboxbear.com",
  "maildrop.cc",
  "crazymailing.com",
  "tempail.com",
  "dropmail.me",
  "nada.ltd",
  "mytemp.email",
  "zillamail.com",
  "emailondeck.com",
  "fakemailgenerator.com",
]);

// ── RFC 5322 Syntax Check ─────────────────────────────────────────────────────
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

/**
 * Checks if a domain is a typo of a known major provider
 */
function detectDomainTypo(domain: string): string | null {
  const lower = domain.toLowerCase();

  // If already an exact major domain, it is definitely not a typo
  if (MAJOR_DOMAINS.includes(lower)) {
    return null;
  }

  // 1. Direct dictionary match
  if (DOMAIN_TYPOS[lower]) {
    return DOMAIN_TYPOS[lower];
  }

  // 2. Check for common mistyped TLDs on popular providers (e.g. gmail.cm, yahoo.con)
  const parts = lower.split(".");
  if (parts.length === 2) {
    const [name, tld] = parts;
    const popularNames = ["gmail", "yahoo", "hotmail", "outlook", "icloud", "protonmail"];
    if (popularNames.includes(name) && TYPO_TLDS.has(tld)) {
      return `${name}.com`;
    }
  }

  // 3. Levenshtein edit distance check (distance <= 2 from major providers)
  for (const major of MAJOR_DOMAINS) {
    const dist = levenshteinDistance(lower, major);
    if (dist > 0 && dist <= 2) {
      return major;
    }
  }

  return null;
}

/**
 * Validates provider-specific username rules (like Gmail's strict 6-30 char requirement)
 */
function validateProviderUsername(
  localPart: string,
  domain: string
): { valid: boolean; error?: string } {
  const lowerDomain = domain.toLowerCase();

  // ── Gmail & Googlemail Rules ───────────────────────────────────────────────
  if (lowerDomain === "gmail.com" || lowerDomain === "googlemail.com") {
    // Strip optional sub-addressing alias: user+alias -> user
    const baseUsername = localPart.split("+")[0];

    // Gmail usernames MUST be between 6 and 30 characters
    if (baseUsername.length < 6) {
      return {
        valid: false,
        error: "Gmail usernames must be at least 6 characters long.",
      };
    }
    if (baseUsername.length > 30) {
      return {
        valid: false,
        error: "Gmail usernames cannot exceed 30 characters.",
      };
    }

    // Gmail only allows letters (a-z), numbers (0-9), and periods (.)
    if (!/^[a-zA-Z0-9.]+$/.test(baseUsername)) {
      return {
        valid: false,
        error: "Gmail usernames can only contain letters (a-z), numbers (0-9), and periods (.).",
      };
    }

    // Cannot start or end with a period
    if (baseUsername.startsWith(".") || baseUsername.endsWith(".")) {
      return {
        valid: false,
        error: "Gmail usernames cannot start or end with a period.",
      };
    }

    // Cannot contain consecutive periods
    if (baseUsername.includes("..")) {
      return {
        valid: false,
        error: "Gmail usernames cannot contain consecutive periods (..).",
      };
    }
  }

  // ── Yahoo Rules ───────────────────────────────────────────────────────────
  if (lowerDomain.startsWith("yahoo.")) {
    const base = localPart.split("-")[0];
    if (base.length < 4 || base.length > 32) {
      return {
        valid: false,
        error: "Yahoo usernames must be between 4 and 32 characters.",
      };
    }
    if (!/^[a-zA-Z]/.test(base)) {
      return {
        valid: false,
        error: "Yahoo usernames must start with a letter.",
      };
    }
  }

  // ── Outlook / Hotmail Rules ───────────────────────────────────────────────
  if (
    lowerDomain === "outlook.com" ||
    lowerDomain === "hotmail.com" ||
    lowerDomain === "live.com"
  ) {
    const base = localPart.split("+")[0];
    if (base.length < 1 || base.length > 64) {
      return {
        valid: false,
        error: "Outlook/Hotmail usernames must be between 1 and 64 characters.",
      };
    }
    if (!/^[a-zA-Z]/.test(base)) {
      return {
        valid: false,
        error: "Outlook/Hotmail usernames must start with a letter.",
      };
    }
    if (base.startsWith(".") || base.endsWith(".") || base.includes("..")) {
      return {
        valid: false,
        error: "Outlook/Hotmail usernames cannot start, end, or have consecutive periods.",
      };
    }
  }

  return { valid: true };
}

/**
 * Checks DNS MX records using Cloudflare DNS-over-HTTPS (DoH).
 * Filters out RFC 7505 Null MX records (0 . or empty host) which explicitly reject email.
 */
async function checkDnsOverHttps(
  domain: string
): Promise<{ exists: boolean; hasMx: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { Accept: "application/dns-json" },
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return { exists: true, hasMx: true };

    const data = (await res.json()) as {
      Status?: number; // 0 = NOERROR, 3 = NXDOMAIN
      Answer?: Array<{ type: number; data: string }>;
    };

    // NXDOMAIN: Domain does not exist
    if (data.Status === 3) {
      return { exists: false, hasMx: false };
    }

    if (data.Answer && data.Answer.length > 0) {
      // Filter out RFC 7505 Null MX records (e.g. "0 .", "0", or empty host)
      const validMx = data.Answer.filter((a) => {
        if (!a.data) return false;
        const trimmed = a.data.trim();
        return trimmed !== "0 ." && trimmed !== "0" && !trimmed.endsWith(" .");
      });

      if (validMx.length > 0) {
        return { exists: true, hasMx: true };
      }

      // If only Null MX record was returned, domain explicitly rejects mail!
      return { exists: false, hasMx: false };
    }

    // If Status === 0 but no MX records, check if A record exists (RFC fallback)
    const aRes = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
      {
        headers: { Accept: "application/dns-json" },
        cache: "no-store",
      }
    );
    if (aRes.ok) {
      const aData = (await aRes.json()) as {
        Status?: number;
        Answer?: Array<{ type: number; data: string }>;
      };
      if (aData.Status === 3) {
        return { exists: false, hasMx: false };
      }
      if (aData.Answer && aData.Answer.length > 0) {
        return { exists: true, hasMx: true };
      }
    }

    return { exists: false, hasMx: false };
  } catch {
    return { exists: true, hasMx: true };
  }
}

/**
 * Resolves MX records using Node's dns.promises with fallback to DoH.
 * Strictly filters out RFC 7505 Null MX records.
 */
async function verifyDomainMx(
  domain: string
): Promise<{ exists: boolean; hasMx: boolean }> {
  try {
    const records = await dns.promises.resolveMx(domain);
    if (records && records.length > 0) {
      // RFC 7505: filter out Null MX records (empty exchange or '.')
      const validRecords = records.filter(
        (r) => r.exchange && r.exchange.trim() !== "" && r.exchange.trim() !== "."
      );

      if (validRecords.length > 0) {
        return { exists: true, hasMx: true };
      }

      // If only null MX records exist, this domain explicitly does not accept email!
      return { exists: false, hasMx: false };
    }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "ENOTFOUND" || code === "NXDOMAIN") {
      return { exists: false, hasMx: false };
    }
    if (code === "ENODATA") {
      // Domain exists but has no MX records. Check A record fallback.
      try {
        const aRecords = await dns.promises.resolve4(domain);
        if (aRecords && aRecords.length > 0) {
          return { exists: true, hasMx: true };
        }
      } catch {
        return { exists: false, hasMx: false };
      }
    }
  }

  // Fallback to DNS-over-HTTPS
  return checkDnsOverHttps(domain);
}

/**
 * Validates and verifies an email address:
 * 1. Syntax & structure check (RFC 5322)
 * 2. Provider username rules (e.g. Gmail 6-30 chars, no invalid symbols)
 * 3. Typo detection & suggestion (e.g. gmail.cm -> gmail.com, gmai.com -> gmail.com)
 * 4. Disposable / burner provider check
 * 5. DNS MX record check (domain existence & mail server verification, rejects RFC 7505 Null MX)
 */
export async function verifyEmail(email: string): Promise<EmailVerificationResult> {
  const trimmed = (email || "").trim();

  // 1. Presence check
  if (!trimmed) {
    return {
      valid: false,
      email: trimmed,
      reason: "invalid_format",
      error: "Email is required.",
    };
  }

  // 2. Format / RFC 5322 check
  if (trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      email: trimmed,
      reason: "invalid_format",
      error: "Please enter a valid email address.",
    };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return {
      valid: false,
      email: trimmed,
      reason: "invalid_format",
      error: "Please enter a valid email address.",
    };
  }

  const [localPart, rawDomain] = parts;
  const domain = rawDomain.toLowerCase();

  // Local part length check
  if (localPart.length > 64) {
    return {
      valid: false,
      email: trimmed,
      reason: "invalid_format",
      error: "Email username is too long.",
    };
  }

  // Top-level domain check: domain must contain at least one dot, and TLD must be >= 2 letters
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (domainParts.length < 2 || !tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return {
      valid: false,
      email: trimmed,
      domain,
      reason: "invalid_format",
      error: "Please enter a valid email domain (e.g. .com, .org).",
    };
  }

  // 3. Typo detection (detects gmail.cm, gmai.com, yahoo.con, etc.)
  const suggestedDomain = detectDomainTypo(domain);
  if (suggestedDomain && suggestedDomain !== domain) {
    const suggestion = `${localPart}@${suggestedDomain}`;
    return {
      valid: false,
      email: trimmed,
      domain,
      reason: "typo",
      suggestion,
      error: `Invalid domain "${domain}". Did you mean ${suggestion}?`,
    };
  }

  // 4. Provider-specific username / ID check (e.g. Gmail 6-30 char check)
  const usernameCheck = validateProviderUsername(localPart, domain);
  if (!usernameCheck.valid) {
    return {
      valid: false,
      email: trimmed,
      domain,
      reason: "invalid_username",
      error: usernameCheck.error ?? "Invalid email username.",
    };
  }

  // 5. Disposable email block
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      email: trimmed,
      domain,
      reason: "disposable",
      error: "Temporary or disposable email addresses are not accepted.",
    };
  }

  // 6. DNS MX record check (checks if domain exists, accepts mail, and is NOT a Null MX record)
  const { exists, hasMx } = await verifyDomainMx(domain);

  if (!exists) {
    return {
      valid: false,
      email: trimmed,
      domain,
      reason: "domain_not_found",
      error: `The email domain "${domain}" does not exist.`,
    };
  }

  if (!hasMx) {
    return {
      valid: false,
      email: trimmed,
      domain,
      reason: "no_mx_records",
      error: `The domain "${domain}" cannot receive emails.`,
    };
  }

  return {
    valid: true,
    email: trimmed,
    domain,
    reason: "valid",
    suggestion: null,
    error: null,
  };
}
