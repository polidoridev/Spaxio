export const CONTACT_EMAIL = "contact@polidori.dev";
export const PROJECT_TYPES = ["AI content", "Luxury visuals", "Brand film", "Other"] as const;
export type Inquiry = { name: string; email: string; projectType: string; message: string };

export function validateInquiry(value: unknown): Inquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.name !== "string" || typeof input.email !== "string" || typeof input.message !== "string") return null;
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const projectType = typeof input.projectType === "string" ? input.projectType.trim() : "Other";
  if (!name || name.length > 120 || /[\r\n]/.test(name)) return null;
  if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) return null;
  if (message.length < 10 || message.length > 5000) return null;
  if (!PROJECT_TYPES.includes(projectType as typeof PROJECT_TYPES[number])) return null;
  return { name, email, projectType, message };
}

export function inquiryText(inquiry: Inquiry): string {
  return ["New AI content inquiry from polidori.dev", "", `Name: ${inquiry.name}`, `Email: ${inquiry.email}`, `Project: ${inquiry.projectType}`, "", inquiry.message].join("\n");
}
