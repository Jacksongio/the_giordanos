# 🚀 Setup Gmail for Password Reset (5 Minutes)

## ✅ What's Done

- ✅ Nodemailer installed
- ✅ Code updated to send emails via Gmail
- ✅ Beautiful HTML email template ready
- ✅ Fallback to console if email fails

## 🎯 What You Need to Do Now

### Step 1: Get Gmail App Password (2 minutes)

1. Go to: **https://myaccount.google.com/apppasswords**
2. Sign in to your Gmail
3. Enable 2-Step Verification (if not already)
4. Create App Password:
   - App: Mail
   - Device: Other (name it "Wedding Website")
5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to .env.local (1 minute)

Create or update `.env.local` in your project root:

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

Replace with:
- Your actual Gmail address
- Your app password (remove spaces)

### Step 3: Add to Convex (1 minute)

```bash
npx convex env set GMAIL_USER "your-email@gmail.com"
npx convex env set GMAIL_APP_PASSWORD "abcdefghijklmnop"
```

### Step 4: Restart Convex (1 minute)

```bash
# In terminal 2, press Ctrl+C, then:
npx convex dev
```

### Step 5: Test It! (30 seconds)

1. Go to your website
2. Click "Sign In" → "Forgot password?"
3. Enter your email
4. **Check your email inbox!** 📧
5. Enter the code from email
6. Reset your password

## 🎉 Done!

Your password reset now sends **real emails** via Gmail!

## 💰 Cost

**$0.00** - Completely FREE forever!

Gmail gives you 500 emails/day for free - more than enough for a wedding website.

## 📧 What Users Get

A beautiful email with:
- Your wedding branding
- Clear reset code
- Professional appearance
- Expires in 1 hour

## 🐛 Troubleshooting

**Email not sending?**
- Check `.env.local` has correct Gmail and password
- Check Convex env vars are set
- Restart Convex after setting env vars
- Check Convex logs for errors

**See full troubleshooting:** `GMAIL_SETUP.md`

---

**Next:** Follow the 5 steps above to enable email sending!

