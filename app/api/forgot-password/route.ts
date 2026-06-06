import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { pool } from '../../../lib/db';

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!result.rows.length)
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });

    const userId = result.rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);
    await pool.query('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, token, expiresAt]);

    const appUrl = process.env.APP_URL;
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    await mailer.sendMail({
      from: `"PlantMate+" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Reset your PlantMate+ password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
            <tr><td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
                <tr>
                  <td style="position:relative;padding:0;margin:0;background:#210E4A;">
                    <img src="${appUrl}/images/mobile-darkMode-01.svg" alt="PlantMate+" width="480"
                      style="display:block;width:100%;max-height:260px;object-fit:cover;" />
                    <div style="position:absolute;bottom:0;left:0;right:0;padding:24px 32px;background:linear-gradient(to top,rgba(33,14,74,0.95) 0%,transparent 100%);">
                      <p style="margin:0 0 4px 0;color:#65F0CD;font-size:12px;letter-spacing:3px;text-transform:uppercase;">PlantMate+</p>
                      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Reset your password</h1>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#210E4A;padding:32px;">
                    <p style="margin:0 0 24px 0;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;">
                      Hi there! We received a request to reset your PlantMate+ password.
                      Click the button below to set a new one. This link expires in <strong style="color:#65F0CD;">1 hour</strong>.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:8px 0 32px;">
                          <a href="${resetLink}" style="display:inline-block;padding:14px 40px;background:#65F0CD;color:#210E4A;font-weight:700;font-size:15px;border-radius:999px;text-decoration:none;letter-spacing:0.5px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 8px 0;color:rgba(255,255,255,0.35);font-size:12px;line-height:1.6;">
                      If you didn't request this, you can safely ignore this email.
                    </p>
                    <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">This link will expire in 1 hour for your security.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#1a0b3a;padding:20px 32px;text-align:center;">
                    <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">
                      &copy; PlantMate+ &nbsp;|&nbsp; You're receiving this because you requested a password reset.
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
