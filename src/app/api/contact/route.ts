import { NextResponse } from "next/server";

type Payload = Record<string, unknown>;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Contact form endpoint.
 * Delivery uses Resend when RESEND_API_KEY and CONTACT_TO_EMAIL are set
 * (CONTACT_FROM_EMAIL must be a verified sender). Without them, submissions are
 * logged in development and rejected in production so messages are never silently lost.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success for bots.
  if (str(body.company_website, 200)) return NextResponse.json({ ok: true });

  const data = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    organization: str(body.organization, 200),
    phone: str(body.phone, 40),
    interest: str(body.interest, 80),
    message: str(body.message, 5000),
  };

  if (data.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10) {
    return NextResponse.json({ error: "Please check the highlighted fields." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "NEXEN POWER Website <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email delivery not configured — submission:", data);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Our contact form is temporarily unavailable." }, { status: 503 });
  }

  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#555;text-transform:capitalize">${k}</td><td style="padding:6px 12px">${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: `Website enquiry — ${data.interest || "General"} — ${data.name}`,
      html: `<h2>New enquiry from nexenpower.in</h2><table>${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn’t send your message right now." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
