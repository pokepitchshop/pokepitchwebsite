# Email Setup for Contact Form

## Setup Instructions

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```
# Email Configuration for Contact Form
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Gmail App Password Setup
For Gmail, you'll need to use an App Password instead of your regular password:

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Enable 2-factor authentication if not already enabled
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Use that password in the `EMAIL_PASS` field

### 3. Alternative Email Services
You can also use other email services by modifying the transporter configuration in `app/api/contact/route.ts`:

#### For Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

#### For Yahoo:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 4. Testing
After setup, test the contact form by:
1. Filling out the form on your website
2. Clicking "Send Message"
3. Checking your email (tom@pokepitchshop.com) for the message

### 5. Security Notes
- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Use App Passwords instead of regular passwords for better security
- Consider using a dedicated email service like SendGrid for production

## Troubleshooting

### Common Issues:
1. **Authentication failed**: Make sure you're using an App Password, not your regular password
2. **Service not found**: Check that your email service is supported by nodemailer
3. **Connection timeout**: Check your internet connection and firewall settings

### Support:
If you need help setting up email functionality, consider using a service like:
- SendGrid
- Mailgun
- AWS SES
- Resend

These services provide more reliable email delivery and better security. 