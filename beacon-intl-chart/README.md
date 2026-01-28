# The Beacon International Survey - Live Results

Real-time visualization of community interest in international trade fairs and missions.

## 📁 Files

```
beacon-intl-chart/
├── api/
│   └── survey-data.js    # Vercel Edge Function (fetches Monday.com data)
├── index.html            # Single-page app (no build required!)
├── vercel.json           # Routing configuration
└── README.md
```

## 🚀 Deploy to Vercel (3 steps)

### Step 1: Create a GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repo (e.g., `beacon-survey-results`)
3. Upload these files to the repo

### Step 2: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click **Deploy** (no build settings needed!)

### Step 3: Add your Monday.com API token
1. In Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `MONDAY_API_TOKEN`
   - **Value:** Your Monday.com API token
3. Click **Save**
4. Go to **Deployments** → click the 3 dots → **Redeploy**

### Getting your Monday.com API Token
1. Go to [monday.com](https://monday.com)
2. Click your profile picture (bottom left)
3. Select **Developers**
4. Go to **My Access Tokens**
5. Click **Show** or create a new token
6. Copy the token (starts with `eyJhb...`)

## ✅ Done!

Your live dashboard will be available at: `https://your-project.vercel.app`

Share this URL with anyone — no login required!

## 🔗 Connected Systems

- **Monday.com Board:** FORM: International Opportunities (ID: 8670560706)
- **Form URL:** https://forms.monday.com/forms/952d3df894af793199474c6caf6b4199

## 📊 Features

- ✅ Real-time updates (every 15 seconds)
- ✅ Bar chart and pie chart views
- ✅ Shows company names (only for those who consented)
- ✅ Mobile responsive
- ✅ No build step required
- ✅ Completely public URL

---

© The Beacon 2025
