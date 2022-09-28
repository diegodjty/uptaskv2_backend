import nodemailer from 'nodemailer';

export const registerEmail = async (data) => {
  const { email, name, token } = data;

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // email information

  const info = await transport.sendMail({
    from: '"UpTask - Projects Manager" <account@uptask.com',
    to: email,
    subject: 'UpTask - Confirm Your Account',
    text: 'Confirm you UpTask account',
    html: `
    
    
        <p>Hi: ${name} Confirm your UpTask acccount</p>
        <p>Your account is almost ready, just confirm your aacount clicking this link</p>
        <a href="${process.env.CLIENT_URL}/confirm/${token}">Confirm Account</a>
        <p>If you didn't create this account, ignore this email</p>`,
  });
};

export const forgotPasswordEmail = async (data) => {
  const { email, name, token } = data;

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // email information

  const info = await transport.sendMail({
    from: '"UpTask - Projects Manager" <account@uptask.com',
    to: email,
    subject: 'UpTask - Reset Your Password',
    text: 'Reset Your Password',
    html: `
    
    
        <p>Hi: ${name} You want to change your password?</p>
        <p>Click this link to reset password</p>
        <a href="${process.env.CLIENT_URL}/forgot-password/${token}">Reset Password</a>
        `,
  });
};
