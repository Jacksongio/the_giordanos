# 🎯 FINAL SOLUTION: Resend Setup (Easiest & Works!)

## Why Resend Instead of Gmail?

After trying Gmail/Nodemailer, I found that **Resend is actually the best solution** because:

✅ **Works with Convex** - No Node.js APIs required (uses HTTP fetch)  
✅ **100% FREE** - 100 emails/day, 3000/month forever  
✅ **NO credit card** - Completely free signup  
✅ **2-minute setup** - Faster than Gmail App Password  
✅ **Works immediately** - Use `onboarding@resend.dev` for testing  

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get Resend API Key (1 minute)

1. Go to: **https://resend.com/signup**
2. Sign up (free, no credit card)
3. Verify your email
4. Go to: **https://resend.com/api-keys**
5. Click "Create API Key"
6. Name it: "Wedding Website"
7. Copy the key (starts with `re_`)

### Step 2: Add to `.env.local` (30 seconds)

```bash
AUTH_RESEND_KEY=re_paste_your_key_here
AUTH_RESEND_FROM=onboarding@resend.dev
```

### Step 3: Add to Convex (30 seconds)

```bash
npx convex env set AUTH_RESEND_KEY "re_paste_your_key_here"
npx convex env set AUTH_RESEND_FROM "onboarding@resend.dev"
```

### Step 4: Test It! (30 seconds)

Convex should already be running without errors now!

1. Go to your website
2. Click "Sign In" → "Forgot password?"
3. Enter your email
4. **Check your email!** 📧

Done! The email should arrive within seconds.

## 📧 What Users Get

Emails from: **The Giordanos Wedding <onboarding@resend.dev>**

With your beautiful HTML template and reset code.

## 🆓 Free Tier

- **100 emails per day**
- **3,000 emails per month**
- **Forever free**
- **No credit card required**

Perfect for a wedding website!

## 🎯 For Production (Optional)

If you want emails from your own domain instead of `onboarding@resend.dev`:

1. Go to: https://resend.com/domains
2. Add your domain
3. Set up DNS records (SPF, DKIM)
4. Update env var:
   ```bash
   AUTH_RESEND_FROM=noreply@yourdomain.com
   ```

But for now, `onboarding@resend.dev` works perfectly!

## ⚡ Why This Works

| Gmail + Nodemailer | Resend |
|-------------------|--------|
| ❌ Needs Node.js APIs | ✅ Works with fetch API |
| ❌ Complex setup | ✅ 2-minute setup |
| ❌ App Password needed | ✅ Just API key |
| ❌ 2-Step Verification | ✅ No extra steps |
| ✅ 500/day free | ✅ 100/day free |

## 🐛 Troubleshooting

### "Failed to send email"

- Check `AUTH_RESEND_KEY` is set in both `.env.local` AND Convex
- Make sure API key starts with `re_`
- Check Resend dashboard for delivery logs

### Email not received

- Check spam folder
- Try a different email address
- Check Resend dashboard: https://resend.com/emails

## ✅ Success Checklist

- [ ] Signed up for Resend (free)
- [ ] Created API key
- [ ] Added `AUTH_RESEND_KEY` to `.env.local`
- [ ] Added `AUTH_RESEND_FROM=onboarding@resend.dev` to `.env.local`
- [ ] Set both in Convex env
- [ ] Tested password reset
- [ ] Received email!

## 🎉 You're Done!

Your password reset now sends **real emails** via Resend!

- ✅ No Node.js errors
- ✅ No complex setup
- ✅ 100% free
- ✅ Works immediately

---

**This is the simplest and best solution!**

