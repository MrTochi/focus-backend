export const verifyEmailTemplate = (name, link) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #1E8A6F;">Welcome to Focus Pad, ${name} 👋</h2>
  <p>Please verify your email to activate your account:</p>
  <a href="${link}" style="background: #1E8A6F; padding: 10px 15px; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
  <p>If you didn’t register, you can ignore this email.</p>
  <p style="margin-top: 30px; font-size: 12px; color: #888;">Focus Pad &copy; ${new Date().getFullYear()}</p>
</div>
`;

export const welcomeEmailTemplate = (name) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #1E8A6F;">Welcome to Focus Pad, ${name} 🎉</h2>
  <p>We’re thrilled to have you on board. Your journey to better focus, clarity, and well-being starts here.</p>
  <p>Explore, connect, and thrive with our easy-to-use platform tailored just for you.</p>
  <p style="margin-top: 20px;">If you have any questions, feel free to reach out.</p>
  <p style="margin-top: 30px; font-size: 12px; color: #888;">Focus Pad &copy; ${new Date().getFullYear()}</p>
</div>
`;

export const resetPasswordTemplate = (name, link) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #1E8A6F;">Reset Your Focus Pad Password</h2>
  <p>Hello ${name},</p>
  <p>Click the button below to reset your password:</p>
  <a href="${link}" style="background: #1E8A6F; padding: 10px 15px; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
  <p>If you didn’t request this, just ignore it.</p>
  <p style="margin-top: 30px; font-size: 12px; color: #888;">Focus Pad &copy; ${new Date().getFullYear()}</p>
</div>
`;

export const forgotPasswordTemplate = (resetUrl, userName) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello ${userName},</h2>
    <p>You recently requested to reset your password.</p>
    <p>Click the button below to reset it. This link will expire in 1 hour.</p>
    <a 
      href="${resetUrl}" 
      style="
        display: inline-block;
        margin: 16px 0;
        padding: 12px 20px;
        background-color: #1E8A6F;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      ">
      Reset Password
    </a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thanks,<br/>The Focus Pad Team</p>
  </div>
`;

export const resetSuccessTemplate = (userName = "User") => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello ${userName},</h2>
    <p>Your password has been successfully reset.</p>
    <p>You can now log in with your new credentials.</p>
    <p>If this wasn't you, please contact support immediately.</p>
    <p>Best regards,<br/>The Focus Pad Team</p>
  </div>
`;

export const accountDeletionTemplate = (userName = "User") => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello ${userName},</h2>
    <p>Your account has been successfully deleted.</p>
    <p>If this wasn't you, please contact support immediately.</p>
    <p>Best regards,<br/>The Focus Pad Team</p>
  </div>
`;

export const todoReminderTemplate = (name, todoTitle, dueDate) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #1E8A6F;">Hey ${name}, here's a quick reminder ⏰</h2>
    <p>Your task <strong>"${todoTitle}"</strong> is due on <strong>${new Date(
  dueDate
).toLocaleString()}</strong>.</p>
    <p>Make sure to complete it on time and stay focused! 💪</p>
    <p style="margin-top: 30px; font-size: 12px; color: #888;">Focus Pad &copy; ${new Date().getFullYear()}</p>
  </div>
`;
