// Utility for parsing and detecting counterparty search types

export type SearchType = "uid" | "phone" | "card" | "name";

export interface ParsedSearch {
  type: SearchType;
  value: string;
  normalized: string;
}

export function parseSearchQuery(query: string): ParsedSearch {
  const trimmed = query.trim();
  
  // UID: обычно цифры, 7-12 символов
  if (/^\d{7,12}$/.test(trimmed)) {
    return {
      type: "uid",
      value: trimmed,
      normalized: trimmed,
    };
  }
  
  // Phone: +7, 8, или просто 10-11 цифр
  const phoneMatch = trimmed.match(/^(\+?7|8)?(\d{10})$/);
  if (phoneMatch) {
    const normalized = `+7${phoneMatch[2]}`;
    return {
      type: "phone",
      value: trimmed,
      normalized,
    };
  }
  
  // Card: 16 цифр (с пробелами или без)
  const cardDigits = trimmed.replace(/\s/g, "");
  if (/^\d{16}$/.test(cardDigits)) {
    return {
      type: "card",
      value: trimmed,
      normalized: cardDigits,
    };
  }
  
  // Name: любой текст с буквами
  if (/[а-яёa-z]/i.test(trimmed)) {
    // Нормализуем: убираем лишние пробелы, приводим к нижнему регистру
    const normalized = trimmed
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    
    return {
      type: "name",
      value: trimmed,
      normalized,
    };
  }
  
  // По умолчанию считаем UID
  return {
    type: "uid",
    value: trimmed,
    normalized: trimmed,
  };
}

export function getSearchTypeLabelshort(type: SearchType): string {
  switch (type) {
    case "uid":
      return "UID";
    case "phone":
      return "Телефон";
    case "card":
      return "Карта";
    case "name":
      return "ФИО";
  }
}

export function getSearchTypeLabel(type: SearchType): string {
  switch (type) {
    case "uid":
      return "по UID";
    case "phone":
      return "по телефону";
    case "card":
      return "по карте";
    case "name":
      return "по ФИО";
  }
}
