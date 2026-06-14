# Formspree Setup - Simple Contact Form Solution

## What is Formspree?
Formspree is a free service that handles contact form submissions and forwards them to your email. No server setup required!

## Setup Steps:

### 1. Create a Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Verify your email address

### 2. Create a New Form
1. Click "New Form"
2. Give it a name like "PokePitchShop Contact"
3. Set the email to: `tom@pokepitchshop.com`
4. Copy the form ID (it will look like: `xrgjabjk`)

### 3. Update Your Code
Replace `YOUR_FORM_ID` in `app/page.tsx` with your actual form ID:

```javascript
const response = await fetch('https://formspree.io/f/xrgjabjk', {
```

### 4. Test the Form
1. Fill out the contact form on your website
2. Submit it
3. Check your email at `tom@pokepitchshop.com`

## Benefits of Formspree:
- ✅ No server setup required
- ✅ Free for up to 50 submissions/month
- ✅ Reliable email delivery
- ✅ Spam protection
- ✅ Works immediately
- ✅ No environment variables needed

## Alternative: Netlify Forms
If you're deploying to Netlify, you can also use their built-in form handling:

```html
<form name="contact" method="POST" data-netlify="true">
  <!-- your form fields -->
</form>
```

## Alternative: EmailJS
Another option is EmailJS which can send emails directly from the browser:

1. Sign up at [emailjs.com](https://emailjs.com)
2. Create an email template
3. Use their JavaScript SDK

## Current Status:
The form is now configured to use Formspree. Just replace `YOUR_FORM_ID` with your actual form ID from Formspree and it will work immediately! 