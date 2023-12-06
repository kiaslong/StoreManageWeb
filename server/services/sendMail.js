const nodemailer = require('nodemailer');




let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "phanphilong17@gmail.com",
      password: "longprobi1",
      clientId: "981677606231-e3o0v0rl3im79s6a8df8e8iggi0qr0s1.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken: "1//0eArv24pgUWLwCgYIARAAGA4SNwF-L9IrsL2cUkZS8k4gxAdk83coRSAatXzzPFHSebEpWj3CXhpdbJqVJzcOJBx6bH9lFN4l-Yk",
      accessToken: "ya29.a0AfB_byB7Dy0U33giB_0kkRTQUjzOQUIJBOY0IOdMB0rHtTLwTkUUyzFnHKw6eX_1A0Al1UuGNmdP3d236wkYLkmm9LnfCDUfUB8FrnF79BkQowb0r7pF89AGe1quXKxTYvIox-Ez-Dnaugdt8VJUhk8qQzZI1dd3v-tBaCgYKAcISARMSFQHGX2Mi2Jzh6OJtXGQfI53-qOf4QA0171",
      expires: 3599,
    },
  });
  
  
const sendEmail = async (emailOptions) => {
  try {
    await transporter.sendMail(emailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};



module.exports = sendEmail;
