# 📧 Gmail Setup for Password Reset Emails (100% FREE!)

## Why Gmail?

✅ **Completely FREE** - No credit card, no API keys, no limits for personal use  
✅ **Super Easy** - Use your existing Gmail account  
✅ **Works Immediately** - No verification, no waiting  
✅ **500 emails/day** - More than enough for a wedding website  
✅ **Professional** - Emails come from your actual Gmail  

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Gmail App Password

Google requires "App Passwords" for apps like this (for security).

1. **Go to your Google Account**
   - Visit: https://myaccount.google.com/apppasswords
   - Or Google "Gmail app password"

2. **Sign in** to your Gmail account

3. **Create an App Password**
   - You might need to enable 2-Step Verification first (Google will prompt you)
   - Select "Mail" as the app
   - Select "Other" as the device
   - Name it: "Wedding Website"
   - Click "Generate"

4. **Copy the 16-character password**
   - It looks like: `abcd efgh ijkl mnop`
   - Save it somewhere - you'll need it in the next step

### Step 2: Add Environment Variables

**Local Development** (`.env.local`):
```bash
# Add these lines to your .env.local file
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Convex**:
```bash
npx convex env set GMAIL_USER "your-email@gmail.com"
npx convex env set GMAIL_APP_PASSWORD "abcdefghijklmnop"
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the 16-character app password (remove spaces)

### Step 3: Test It!

```bash
# Restart Convex to pick up new env vars
# Press Ctrl+C in terminal 2, then:
npx convex dev
```

Now try the password reset flow:
1. Go to your website
2. Click "Sign In" → "Forgot password?"
3. Enter your email
4. **Check your actual email inbox!** 📧

You should receive a beautiful email with your reset code!

## 📧 What Users Will See

Users will receive an email like this:

```
From: The Giordanos Wedding <your-email@gmail.com>
Subject: Reset Your Password - The Giordanos Wedding

🎉 The Giordanos Wedding

Reset Your Password

You requested to reset your password. Here's your verification code:

12345678

Enter this code on the password reset page to continue.

This code will expire in 1 hour.
```

## 🔒 Security Notes

### Is This Secure?

✅ **YES!** - App passwords are designed for this exact use case  
✅ **Better than storing your real password**  
✅ **Can be revoked anytime** from your Google Account  
✅ **Limited to just sending email**  

### Best Practices

1. **Use a dedicated Gmail** (optional but recommended)
   - Create a new Gmail like: `thegiordanoswedding@gmail.com`
   - Use that for sending wedding-related emails
   - Keeps your personal email separate

2. **Never commit `.env.local`**
   - It's already in `.gitignore`
   - Never share your app password

3. **Revoke if compromised**
   - Go to https://myaccount.google.com/apppasswords
   - Delete the app password
   - Create a new one

## 📊 Gmail Limits

Gmail allows:
- **500 emails per day** for personal accounts
- **2000 emails per day** for Google Workspace accounts

For a wedding website, 500/day is MORE than enough!

## 🆚 Comparison with Other Services

| Service | Free Tier | Setup Time | Credit Card? |
|---------|-----------|------------|--------------|
| **Gmail + Nodemailer** | 500/day forever | 5 min | ❌ No |
| Resend | 100/day, 3000/month | 10 min | ❌ No |
| SendGrid | 100/day | 15 min | ✅ Yes |
| AWS SES | Very cheap | 30 min+ | ✅ Yes |
| Mailgun | 5000/month (3 months) | 15 min | ✅ Yes |

**Gmail wins for simplicity and no credit card required!**

## 🐛 Troubleshooting

### "Invalid login" error

**Problem**: App password is wrong or not enabled  
**Solution**:
1. Make sure you enabled 2-Step Verification
2. Regenerate the app password
3. Copy it exactly (remove spaces)
4. Update `.env.local` and Convex env vars

### Email goes to spam

**Problem**: Gmail might flag it as spam initially  
**Solution**:
1. Check your spam folder
2. Mark as "Not Spam"
3. Future emails will go to inbox
4. This is normal for first-time senders

### "Less secure app access"

**Problem**: Old Gmail settings  
**Solution**: Google now requires App Passwords (which you just set up). You're good!

### Email not received

**Problem**: Wrong Gmail address or password  
**Solution**:
1. Verify `GMAIL_USER` is correct in Convex env
2. Verify `GMAIL_APP_PASSWORD` is correct (no spaces)
3. Check Convex logs for errors
4. Try sending a test email manually

## 🧪 Testing

To test if Gmail is working:

1. **Request a password reset**
   - Go to "Forgot password?"
   - Enter your email
   - Click "Send Reset Code"

2. **Check Convex logs** (terminal 2)
   - Should see: `✅ Email sent successfully via Gmail!`
   - If error, see troubleshooting above

3. **Check your email**
   - Should arrive within seconds
   - Check spam if not in inbox

4. **Use the code**
   - Copy code from email
   - Enter in password reset form
   - Reset your password!

## 💡 Pro Tips

### Tip 1: Create a Dedicated Email
```bash
# Instead of your personal Gmail:
GMAIL_USER=thegiordanoswedding@gmail.com
```

Benefits:
- Professional sender name
- Separate from personal email
- Easy to manage wedding-related emails

### Tip 2: Customize the "From" Name
The emails will show as:
```
From: The Giordanos Wedding <your-email@gmail.com>
```

The display name is already set to "The Giordanos Wedding" in the code!

### Tip 3: Test Locally First
Before deploying, test the email flow locally:
1. Use your personal Gmail for testing
2. Send yourself a reset email
3. Verify it looks good
4. Then deploy to production

## 🚀 Production Deployment

When deploying to production (Vercel, etc.):

1. **Add env vars to your hosting platform**
   - Vercel: Project Settings → Environment Variables
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`

2. **Update Convex production env**
   ```bash
   npx convex env set --prod GMAIL_USER "your-email@gmail.com"
   npx convex env set --prod GMAIL_APP_PASSWORD "your-app-password"
   ```

3. **Deploy and test**
   - Deploy your app
   - Test password reset in production
   - Check emails are being sent

## ✅ Success Checklist

- [ ] Enabled 2-Step Verification on Gmail
- [ ] Created App Password
- [ ] Added `GMAIL_USER` to `.env.local`
- [ ] Added `GMAIL_APP_PASSWORD` to `.env.local`
- [ ] Set `GMAIL_USER` in Convex env
- [ ] Set `GMAIL_APP_PASSWORD` in Convex env
- [ ] Restarted `npx convex dev`
- [ ] Tested password reset flow
- [ ] Received email successfully
- [ ] Code worked and password was reset

## 🎉 You're Done!

Your password reset now sends **real emails** via Gmail - completely free, forever!

---

**Questions?** Check the troubleshooting section above or check Convex logs for errors.

