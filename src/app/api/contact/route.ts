import { Resend } from "resend";
import { NextResponse } from "next/server";
import { verifyEmail } from "@/lib/emailVerifier";

// ── Initialise Resend with the server-side-only API key ───────────────────────
// process.env.RESEND_API_KEY is NEVER sent to the browser — this file is a
// Route Handler and always runs on the Node.js server.
const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT = "albinrejim30@gmail.com";

// ── POST /api/contact ─────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Verify whether the return email format, domain, and MX records exist
    const emailVerification = await verifyEmail(email.trim());
    if (!emailVerification.valid) {
      return NextResponse.json(
        { error: emailVerification.error ?? "Please provide a valid return email address." },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "long",
      timeStyle: "short",
    });

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: RECIPIENT,
      replyTo: email.trim(),
      // Clean, recognisable subject for Gmail inbox
      subject: `New Message // ${name.trim()} — albinreji.dev`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Message — albinreji.dev</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:20px 12px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;background:#141414;border:1px solid #222;overflow:hidden;">

          <!-- Header bar -->
          <tr>
            <td style="background:#DFFF35;padding:10px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#111;font-family:ui-monospace,monospace;line-height:1;">
                      PORTFOLIO // TRANSMISSION RECEIVED
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:8px;font-weight:600;letter-spacing:0.12em;color:rgba(17,17,17,0.6);font-family:ui-monospace,monospace;line-height:1;">
                      albinreji.dev
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FROM + RETURN EMAIL — two-column row -->
          <tr>
            <td style="padding:18px 20px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Sender name -->
                  <td width="48%" style="vertical-align:top;padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:7.5px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#4a4a4a;font-family:ui-monospace,monospace;line-height:1;">FROM</p>
                    <p style="margin:0;font-size:20px;font-weight:700;color:#EFEFEF;letter-spacing:-0.02em;line-height:1.15;">${name.trim()}</p>
                  </td>
                  <!-- Return email -->
                  <td width="52%" style="vertical-align:top;padding-left:12px;border-left:1px solid #222;">
                    <p style="margin:0 0 4px;font-size:7.5px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#4a4a4a;font-family:ui-monospace,monospace;line-height:1;">RETURN EMAIL</p>
                    <a href="mailto:${email.trim()}" style="color:#DFFF35;font-size:12px;font-weight:600;text-decoration:none;word-break:break-all;line-height:1.4;display:block;">${email.trim()}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:14px 20px 0;">
              <div style="height:1px;background:#222;"></div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:14px 20px;">
              <p style="margin:0 0 8px;font-size:7.5px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#4a4a4a;font-family:ui-monospace,monospace;line-height:1;">MESSAGE</p>
              <p style="margin:0;font-size:14px;color:#C0C0C0;line-height:1.7;white-space:pre-wrap;border-left:2px solid #DFFF35;padding-left:12px;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:0 20px 18px;">
              <a href="mailto:${email.trim()}?subject=Re%3A%20Your%20message%20to%20Albin%20Reji" style="display:inline-block;background:#DFFF35;color:#111;font-size:8px;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;text-decoration:none;padding:10px 18px;font-family:ui-monospace,monospace;line-height:1;">
                ↗ REPLY TO ${name.trim().toUpperCase()}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:10px 20px;border-top:1px solid #1c1c1c;background:#111;">
              <p style="margin:0;font-size:7.5px;color:#333;font-family:ui-monospace,monospace;letter-spacing:0.1em;line-height:1.6;">
                SUBMITTED // ${submittedAt} · Delivered via albinreji.dev portfolio contact form
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
