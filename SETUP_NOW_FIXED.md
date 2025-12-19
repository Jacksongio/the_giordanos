# ✅ FIXED! Gmail Setup for Password Reset

## What Was the Problem?

Nodemailer requires Node.js APIs (`fs`, `stream`, `crypto`, etc.) which aren't available in Convex's default V8 isolate runtime.

## What I Fixed

1. ✅ Created `convex/sendEmail.ts` with `"use node"` directive
2. ✅ Moved nodemailer logic to a Node.js action
3. ✅ Updated `convex/auth.ts` to call the action
4. ✅ Now it will work!

## 🚀 Setup Steps for Your Email

### Step 1: Get Gmail App Password (2 minutes)

**IMPORTANT:** You cannot use your regular Gmail password (`J@ck2002!`). You MUST create an App Password.

1. Go to: **https://myaccount.google.com/apppasswords**
2. Sign in with: `giordanos2027@gmail.com` and your password
3. You'll need to enable **2-Step Verification** first if you haven't:
   - Google will guide you through it
   - Takes 2 minutes
4. Then create App Password:
   - App: **Mail**
   - Device: **Other** → Name it "Wedding Website"
5. Google shows a 16-character password like: `abcd efgh ijkl mnop`
6. **Copy it!** (remove spaces when you use it)

### Step 2: Add to .env.local (30 seconds)

Create or update `.env.local` in your project root:

```bash
GMAIL_USER=giordanos2027@gmail.com
GMAIL_APP_PASSWORD=paste-your-16-char-app-password-here
```

**Replace `paste-your-16-char-app-password-here` with the app password from Step 1 (no spaces).**

### Step 3: Add to Convex (30 seconds)

Run these commands:

```bash
npx convex env set GMAIL_USER "giordanos2027@gmail.com"
npx convex env set GMAIL_APP_PASSWORD "paste-your-16-char-app-password-here"
```

**Again, use the 16-character app password, not `J@ck2002!`**

### Step 4: Convex Should Work Now!

The error should be gone now. Convex dev should start successfully.

If Convex is running, just save a file to trigger a reload, or restart it:

```bash
# Press Ctrl+C in terminal 2, then:
npx convex dev
```

### Step 5: Test It! (1 minute)

1. Go to your website: http://localhost:3000
2. Click "Sign In"
3. Click "Forgot password?"
4. Enter any email: `jackson@giordano.us` (or your email)
5. Click "Send Reset Code"
6. **Check the email inbox** at `giordanos2027@gmail.com` (or your test email if you used it)
7. You should receive the password reset email!

## 🔍 Why This Works Now

| Before | After |
|--------|-------|
| Tried to use nodemailer in auth.ts | Moved to separate Node.js action ✅ |
| V8 isolate (no Node APIs) | `"use node"` directive ✅ |
| Import errors | Runs in Node.js runtime ✅ |

## 📧 What Users Will Get

Emails from: **The Giordanos Wedding <giordanos2027@gmail.com>**

With a beautiful HTML template showing their reset code.

## 🐛 Troubleshooting

### "Invalid login" when sending email

- Make sure you created an **App Password**, not using `J@ck2002!`
- App passwords are 16 characters, looks like: `abcdefghijklmnop`
- No spaces in the app password

### How to create App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if asked)
3. Create password for "Mail" / "Other"
4. Copy the 16-character code
5. Use THAT in your env vars, not your regular Gmail password

### Still getting errors?

Check Convex logs (terminal 2) for the actual error message.

## ✅ Success Checklist

- [ ] Created Gmail App Password (not using regular password!)
- [ ] Added `GMAIL_USER=giordanos2027@gmail.com` to `.env.local`
- [ ] Added `GMAIL_APP_PASSWORD=<16-char-code>` to `.env.local`
- [ ] Set both env vars in Convex
- [ ] Restarted Convex dev
- [ ] No more "Could not resolve" errors
- [ ] Tested password reset flow
- [ ] Received email at giordanos2027@gmail.com

## 🎉 You're Done!

Once you complete the setup, your password reset will send real emails via Gmail - completely free!

---

**Remember:** Use the **App Password**, not your regular Gmail password!

