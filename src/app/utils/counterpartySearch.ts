// Robust counterparty search parser (MVP)
// Supports: uid, phone, card, fio, nickname, profile url

export type ExchangeId = "all" | "htx" | "bybit" | "okx" | "gate" | "mexc" | "bitget";

export type SearchType =
  | "uid"
  | "phone"
  | "card"
  | "fio"
  | "nickname"
  | "profile_url";

export interface ParsedSearch {
  type: SearchType;
  value: string;
  normalized: string;
  exchange?: ExchangeId;
}

const EXCHANGE_URL_RULES: Array<{ exchange: ExchangeId; re: RegExp }> = [
  { exchange: "htx", re: /https?:\/\/(?:www\.)?(?:htx|huobi)\.[^\s/]+/i },
  { exchange: "bybit", re: /https?:\/\/(?:www\.)?bybit\.[^\s/]+/i },
  { exchange: "okx", re: /https?:\/\/(?:www\.)?okx\.[^\s/]+/i },
  { exchange: "gate", re: /https?:\/\/(?:www\.)?gate\.(?:io|com)\b/i },
  { exchange: "mexc", re: /https?:\/\/(?:www\.)?mexc\.[^\s/]+/i },
  { exchange: "bitget", re: /https?:\/\/(?:www\.)?bitget\.[^\s/]+/i },
];

function normalizeSpaces(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

export function normalizePhoneRU(raw: string): string | null {
  // Accept: +7..., 7..., 8... with any separators (spaces, (), -)
  const digits = raw.replace(/\D/g, "");

  // +7XXXXXXXXXX -> digits starts with 7 and length 11
  // 8XXXXXXXXXX -> convert to 7XXXXXXXXXX
  // 7XXXXXXXXXX -> ok
  // Sometimes users paste 10 digits without prefix – accept as RU by assuming 7
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith("7")) return `+7${digits.slice(1)}`;
  if (digits.length === 10) return `+7${digits}`;
  return null;
}

export function normalizeCard(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  // MVP: accept only 16 digits (RU cards). Later can extend to 19.
  if (/^\d{16}$/.test(digits)) return digits;
  return null;
}

function looksLikeFio(text: string): boolean {
  // Heuristics for FIO / Full name (RU + EN):
  // RU:
  //   - 1-3 tokens
  //   - Cyrillic letters
  //   - allow initials
  // EN:
  //   - 2-3 tokens (to avoid confusing with nickname)
  //   - Latin letters only (no digits/symbols)
  //   - prefer TitleCase (but not mandatory)
  const s = normalizeSpaces(text);
  const tokens = s.split(" ").filter(Boolean);
  if (tokens.length < 1 || tokens.length > 3) return false;

  const hasCyr = /[А-Яа-яЁё]/.test(s);
  const hasLat = /[A-Za-z]/.test(s);

  const tokenOk = (t: string) => {
    // Initial like "И" or "И." or "J" / "J."
    if (/^[A-Za-zА-ЯЁ]\.?$/.test(t)) return true;
    // Name-like word (letters + optional hyphen)
    if (/^[A-Za-zА-Яа-яЁё]+(?:-[A-Za-zА-Яа-яЁё]+)?$/.test(t)) return true;
    return false;
  };
  if (!tokens.every(tokenOk)) return false;

  // Cyrillic: allow 1 token as surname
  if (hasCyr) return true;

  // Latin: require 2-3 tokens, and no digits/symbols already ensured
  if (hasLat) {
    if (tokens.length < 2) return false;
    // Prefer distinguishing from nickname: if all tokens are lowercase words, treat as nickname
    const anyUpper = tokens.some((t) => /^[A-Z]/.test(t));
    if (!anyUpper) return false;
    return true;
  }

  return false;
}

export function parseSearchQuery(query: string): ParsedSearch {
  const trimmed = query.trim();
  const s = normalizeSpaces(trimmed);

  // URL (profile)
  if (/^https?:\/\//i.test(s)) {
    const matched = EXCHANGE_URL_RULES.find((r) => r.re.test(s));
    return {
      type: "profile_url",
      value: trimmed,
      normalized: s,
      exchange: matched?.exchange,
    };
  }

  // UID: numbers 6-20 (different exchanges differ). Keep strict to avoid card/phone.
  if (/^\d{6,20}$/.test(s)) {
    // phone-like 10/11 digits handled below; but if exactly 16 digits, it's card
    if (s.length === 16) {
      return { type: "card", value: trimmed, normalized: s };
    }
    if (s.length === 10 || s.length === 11) {
      const phone = normalizePhoneRU(s);
      if (phone) return { type: "phone", value: trimmed, normalized: phone };
    }
    return { type: "uid", value: trimmed, normalized: s };
  }

  // Phone (various formats)
  const phone = normalizePhoneRU(s);
  if (phone) {
    return { type: "phone", value: trimmed, normalized: phone };
  }

  // Card
  const card = normalizeCard(s);
  if (card) {
    return { type: "card", value: trimmed, normalized: card };
  }

  // FIO
  if (looksLikeFio(s)) {
    return {
      type: "fio",
      value: trimmed,
      normalized: s,
    };
  }

  // Nickname: any non-empty text; keep as-is (trimmed spaces collapsed)
  return {
    type: "nickname",
    value: trimmed,
    normalized: s,
  };
}

export function getSearchTypeLabel(type: SearchType): string {
  switch (type) {
    case "uid":
      return "по UID";
    case "phone":
      return "по телефону";
    case "card":
      return "по карте";
    case "fio":
      return "по ФИО";
    case "nickname":
      return "по нику";
    case "profile_url":
      return "по ссылке";
  }
}

export function getSearchTypeLabelShort(type: SearchType): string {
  switch (type) {
    case "uid":
      return "UID";
    case "phone":
      return "Телефон";
    case "card":
      return "Карта";
    case "fio":
      return "ФИО";
    case "nickname":
      return "Ник";
    case "profile_url":
      return "Ссылка";
  }
}
