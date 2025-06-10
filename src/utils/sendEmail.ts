export const sendResetEmail = async (email: string, resetToken: string) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  // Replace with actual email logic
  console.log(`Send email to ${email} with link: ${resetLink}`);
};
export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  // Replace with actual email logic
  console.log(`Send email to ${email} with link: ${verificationLink}`);
};
