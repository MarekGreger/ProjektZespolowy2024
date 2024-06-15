export const roles = ["brak", "klient", "pracownik", "kierownik", "admin"] as const;

export const roleGreaterOrEqual = (roleA: Role, roleB: Role): boolean => roles.indexOf(roleA) >= roles.indexOf(roleB)

export type Role = typeof roles[number];