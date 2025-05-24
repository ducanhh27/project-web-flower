import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Hoặc SMTP khác
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: 'your-email@gmail.com',
      to,
      subject: 'Reset Password',
      html: `
      <p>Xin chào,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Thăng Long Farm</strong>. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
      <p><a href="${resetLink}" style="display:inline-block;padding:10px 15px;background-color:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Đặt lại mật khẩu</a></p>
      <p>Hoặc bạn có thể sao chép và dán liên kết này vào trình duyệt:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Liên kết có hiệu lực trong 15 phút.</p>
      <p>Trân trọng,<br/>Đội ngũ Thăng Long Farm</p>
    `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
