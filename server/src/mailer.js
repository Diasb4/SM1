import nodemailer from 'nodemailer';

let transporter = null;

// Initialize Transporter
export async function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    // Production SMTP (Office 365, Gmail, Mailgun, etc.)
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    console.log(`[MAILER] Configured real SMTP server: ${SMTP_HOST}:${SMTP_PORT || 587} for ${SMTP_USER}`);
  } else {
    // Fallback: Ethereal test inbox or direct SMTP simulator with valid HTML templates
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[MAILER] Ethereal SMTP test account active: ${testAccount.user}`);
    } catch {
      // Offline fallback transport
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporter;
}

/**
 * Send 6-Digit Verification Code to student corporate email
 */
export async function sendOtpEmail(toEmail, code, role = 'mentee') {
  const mailer = await getTransporter();
  const roleNameMap = {
    mentee: 'Студент (1 курс)',
    mentor: 'Ментор (Старшекурсник)',
    hard_mentor: 'Академический тьютор (Hard Mentor)'
  };

  const roleText = roleNameMap[role] || 'Студент';
  const fromAddress = process.env.SMTP_FROM || '"Astana IT University · Mentorship" <auth@astanait.edu.kz>';

  const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Код подтверждения AITU</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
    .card { max-width: 520px; margin: 0 auto; background-color: #1e293b; border-radius: 20px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    .header { background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%); padding: 32px 24px; text-align: center; }
    .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 4px; }
    .sublogo { font-size: 12px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
    .code-box { background: #0f172a; border: 2px dashed #3b82f6; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .code-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 6px; }
    .code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #60a5fa; margin: 0; }
    .badge { display: inline-block; background-color: #334155; color: #e2e8f0; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px; }
    .footer { border-top: 1px solid #334155; padding: 20px 28px; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center; }
    .warning { color: #f59e0b; font-size: 12px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Astana IT University</div>
      <div class="sublogo">Peer Mentorship Network · Студенческое сообщество</div>
    </div>
    <div class="content">
      <div class="greeting">Здравствуйте!</div>
      <div class="badge">Роль входа: ${roleText}</div>
      <div class="text">
        Вы запросили одноразовый код для входа в <strong>AITU Mentorship Platform</strong>. Используйте данный код для подтверждения вашей корпоративной почты:
      </div>
      
      <div class="code-box">
        <div class="code-label">Ваш 6-значный код безопасности:</div>
        <div class="code">${code}</div>
      </div>

      <div class="warning">
        ⚠️ Код действителен в течение <strong>10 минут</strong>. Не передавайте данный код третьим лицам.
      </div>
    </div>
    <div class="footer">
      Это автоматическое сообщение от системы наставничества Astana IT University.<br>
      Если вы не запрашивали данный код, просто проигнорируйте это письмо.<br>
      © ${new Date().getFullYear()} Astana IT University · пр. Мангилик Ел, С1
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: fromAddress,
    to: toEmail,
    subject: `🔐 ${code} — Ваш код безопасности для входа в AITU Mentorship`,
    text: `Ваш 6-значный код безопасности для входа в AITU Mentorship: ${code}. Код действует 10 минут.`,
    html: htmlContent
  };

  const info = await mailer.sendMail(mailOptions);
  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log(`[MAIL DISPATCHED] Email sent to: ${toEmail} | MessageId: ${info.messageId}`);
  if (previewUrl) {
    console.log(`[MAIL PREVIEW URL] 🌐 Просмотреть письмо онлайн: ${previewUrl}`);
  }

  return {
    messageId: info.messageId,
    previewUrl: previewUrl || null
  };
}

