import dotenv from "dotenv";
dotenv.config();

const welcomeEmailTemplate = (fullname) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to ChatPulse</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #f4f4f8;
      font-family: Arial, sans-serif;
      padding: 40px 16px;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e2f0;
    }

    /* ── Header ─────────────────────────────────────── */
    .email-header {
      background: #1a1a2e;
      padding: 48px 40px 40px;
      text-align: center;
    }

    .pulse-ring {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(99,102,241,0.2);
      margin-bottom: 20px;
      position: relative;
    }

    .pulse-ring::before {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1.5px solid rgba(99,102,241,0.3);
    }

    .pulse-ring::after {
      content: '';
      position: absolute;
      inset: -16px;
      border-radius: 50%;
      border: 1px solid rgba(99,102,241,0.15);
    }

    .pulse-icon {
      font-size: 32px;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0 0 6px;
    }

    .brand-name span { color: #818cf8; }

    .brand-tagline {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* ── Body ───────────────────────────────────────── */
    .email-body { padding: 40px 40px 32px; }

    .online-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.3);
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
      color: #059669;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      display: inline-block;
    }

    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 16px;
    }

    .body-text {
      font-size: 15px;
      color: #6b7280;
      line-height: 1.7;
      margin: 0 0 28px;
    }

    .quote-block {
      border-left: 3px solid #4f46e5;
      padding: 12px 16px;
      margin: 0 0 28px;
      background: #f8f7ff;
      border-radius: 0 8px 8px 0;
    }

    .quote-text {
      font-size: 14px;
      color: #6b7280;
      font-style: italic;
      line-height: 1.6;
    }

    /* ── Features ───────────────────────────────────── */
    .feature-card {
      background: #f9f9fc;
      border: 1px solid #e2e2f0;
      border-radius: 12px;
      padding: 16px;
      vertical-align: top;
    }

    .feature-icon {
      font-size: 22px;
      margin-bottom: 10px;
      display: block;
    }

    .feature-title {
      font-size: 13px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 4px;
    }

    .feature-desc {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }

    /* ── CTA ─────────────────────────────────────────── */
    .cta-wrap {
      text-align: center;
      margin: 32px 0;
    }

    .cta-btn {
      display: inline-block;
      background: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
    }

    .divider {
      border: none;
      border-top: 1px solid #e2e2f0;
      margin: 0 0 24px;
    }

    .footer-note {
      font-size: 14px;
      color: #9ca3af;
      line-height: 1.7;
    }

    /* ── Footer ─────────────────────────────────────── */
    .email-footer {
      background: #f9f9fc;
      border-top: 1px solid #e2e2f0;
      padding: 24px 40px;
      text-align: center;
    }

    .footer-text {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.7;
      margin: 0 0 8px;
    }

    .footer-links { font-size: 12px; color: #9ca3af; }
    .footer-links a { color: #818cf8; text-decoration: none; }
  </style>
</head>
<body>

  <div class="email-wrapper">

    <!-- Header -->
    <div class="email-header">
      <div class="pulse-ring">
        <span class="pulse-icon">💬</span>
      </div>
      <h1 class="brand-name">Chat<span>Pulse</span></h1>
      <p class="brand-tagline">Real-time conversations</p>
    </div>

    <!-- Body -->
    <div class="email-body">

      <div class="online-badge">
        <span class="dot"></span>
        You're now live
      </div>

      <h2 class="greeting">Welcome, ${fullname}! 🎉</h2>

      <p class="body-text">
        Hey ${fullname} — we're thrilled to have you with us. ChatPulse is where
        real conversations happen in real time, with real people. No delays, no
        refresh needed — just instant, flowing dialogue.
      </p>

      <div class="quote-block">
        <p class="quote-text">
          "The best conversations happen when there's no lag between thought and connection."
        </p>
      </div>

      <!-- Features -->
      <table width="100%" cellpadding="6" cellspacing="0" border="0" style="margin-bottom: 8px;">
        <tr>
          <td width="50%" style="padding-right: 6px;">
            <div class="feature-card">
              <span class="feature-icon">⚡</span>
              <p class="feature-title">Instant messaging</p>
              <p class="feature-desc">Zero delay, real-time delivery</p>
            </div>
          </td>
          <td width="50%" style="padding-left: 6px;">
            <div class="feature-card">
              <span class="feature-icon">👥</span>
              <p class="feature-title">Group rooms</p>
              <p class="feature-desc">Talk with many at once</p>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding-right: 6px; padding-top: 12px;">
            <div class="feature-card">
              <span class="feature-icon">🔒</span>
              <p class="feature-title">Private chats</p>
              <p class="feature-desc">Secure one-on-one messages</p>
            </div>
          </td>
          <td width="50%" style="padding-left: 6px; padding-top: 12px;">
            <div class="feature-card">
              <span class="feature-icon">📱</span>
              <p class="feature-title">Any device</p>
              <p class="feature-desc">Works on mobile and desktop</p>
            </div>
          </td>
        </tr>
      </table>

      <!-- CTA -->
      <div class="cta-wrap">
        <a href="${process.env.CLIENT_URL}" class="cta-btn">Start chatting now →</a>
      </div>

      <hr class="divider" />

      <p class="footer-note">
        If you have any questions, just reply to this email — we read every single one.
        Happy chatting! 💬
      </p>

    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p class="footer-text">
        You received this email because you signed up for ChatPulse.<br />
        If this wasn't you, you can safely ignore this email.
      </p>
      <p class="footer-links">
        <a href="#">Unsubscribe</a> &nbsp;·&nbsp;
        <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
        <a href="#">Support</a>
      </p>
    </div>

  </div>

</body>
</html>
`;
export{
    welcomeEmailTemplate
}