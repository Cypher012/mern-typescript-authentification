export const generateEmailTemplate = (
  type: "verification" | "reset",
  id: string,
  name: string,
  code: string
) => {
  const subject =
    type === "verification" ? "Email Verification" : "Password Reset";
  const message =
    type === "verification"
      ? `Thank you for registering with us. Please verify your email address by using the verification code below:`
      : `We received a request to reset your password. Please use the code below to reset your password:`;
  // const codeLabel = type === 'verification' ? 'Verification Code' : 'Password Reset Code';

  return `
        <div>
          <h1>${subject}</h1>
          <p>Dear ${name},</p>
          <p>${message}</p>
          <h2><strong>${code}</strong></h2>
          <p>_id: ${id}</p>
          <p>If you did not ${
            type === "verification"
              ? "create an account"
              : "request a password reset"
          }, please ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} Cipher. All rights reserved.</p>
        </div>
    `;
};
