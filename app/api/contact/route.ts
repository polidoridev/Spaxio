import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL, inquiryText, validateInquiry } from "@/lib/contact";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected a JSON inquiry." }, { status: 415 });
  }
  if (Number(req.headers.get("content-length")) > 24000) {
    return NextResponse.json({ error: "Inquiry is too long." }, { status: 413 });
  }
  let body: unknown;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 24000) {
      return NextResponse.json({ error: "Inquiry is too long." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid inquiry." }, { status: 400 });
  }
  // Hidden field catches basic automated form submissions without mailing them.
  if (body && typeof body === "object" && "companyWebsite" in body && body.companyWebsite) {
    return NextResponse.json({ ok: true });
  }
  const inquiry = validateInquiry(body);
  if (!inquiry) {
    return NextResponse.json({ error: "Check your name, email, project type, and message (10–5,000 characters)." }, { status: 400 });
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const port = Number(SMTP_PORT);
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !Number.isInteger(port) || port < 1 || port > 65535) {
    return NextResponse.json({ error: `The form is temporarily unavailable. Please email ${CONTACT_EMAIL} directly.` }, { status: 503 });
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const delivery = await transporter.sendMail({
      from: { name: "Polidori Dev inquiries", address: SMTP_USER },
      to: CONTACT_EMAIL,
      replyTo: { name: inquiry.name, address: inquiry.email },
      subject: "New AI content inquiry | Polidori Dev",
      text: inquiryText(inquiry),
    });
    if (!delivery.accepted?.some((address: string | { address: string }) => (typeof address === "string" ? address : address.address).toLowerCase() === CONTACT_EMAIL)) {
      throw new Error("Recipient not accepted");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: `Your inquiry could not be confirmed. Please email ${CONTACT_EMAIL} directly.` }, { status: 502 });
  } finally {
    transporter.close();
  }
}
