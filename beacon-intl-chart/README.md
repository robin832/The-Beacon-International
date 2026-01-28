# The Beacon International Survey - Live Results Dashboard

Real-time visualization of community interest in international trade fairs and missions for 2025.

## 🚀 Quick Deploy to Vercel

### 1. Get Your Monday.com API Token

1. Go to [Monday.com](https://monday.com)
2. Click your profile picture → **Developers**
3. Select **My Access Tokens**
4. Create a new token with `boards:read` permission
5. Copy the token (starts with `eyJhb...`)

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_REPO_HERE)

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project folder
cd beacon-intl-chart

# Deploy
vercel

# Follow prompts, then add environment variable:
vercel env add MONDAY_API_TOKEN
# Paste your Monday.com API token when prompted

# Redeploy with the environment variable
vercel --prod
```

### 3. Configure Environment Variables

In your Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add: `MONDAY_API_TOKEN` = your Monday.com API token

## 📊 Features

- **Real-time updates** - Auto-refreshes every 15 seconds
- **Interactive charts** - Toggle between bar and pie chart views
- **Company visibility** - Shows companies who consented to be displayed
- **Mobile responsive** - Works great on all devices
- **Beautiful design** - Dark theme with colorful, accessible visualization

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Create .env.local file
echo "MONDAY_API_TOKEN=your_token_here" > .env.local

# Run development server
npm run dev
```

## 📁 Project Structure

```
beacon-intl-chart/
├── api/
│   └── survey-data.js    # Vercel serverless function (fetches Monday.com data)
├── src/
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # Entry point
│   └── index.css         # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔗 Connected Systems

- **Monday.com Board ID**: `8670560706`
- **Form URL**: https://forms.monday.com/forms/952d3df894af793199474c6caf6b4199

## 📋 Tracked Opportunities

| Event | Location | Date |
|-------|----------|------|
| Viva Tech | Paris 🇫🇷 | June |
| Smart City World Expo | Barcelona 🇪🇸 | November |
| Slush | Helsinki 🇫🇮 | November |
| Hannover Messe | Hannover 🇩🇪 | April |
| Drone Summit | Riga 🇱🇻 | May |
| Upstream Festival | Rotterdam 🇳🇱 | May |
| Possidonia | Athens 🇬🇷 | June |
| FIT Ports & Trade Mission | Malaysia 🇲🇾 | September |

## 🛠️ Customization

### Change colors
Edit the `OPPORTUNITIES` object in `src/App.jsx`:

```javascript
const OPPORTUNITIES = {
  "Event Name": { short: "Short Name", color: "#HEX", flag: "🏳️" },
  // ...
};
```

### Change refresh interval
In `src/App.jsx`, find the `setInterval` call:

```javascript
const interval = setInterval(fetchData, 15000); // Change 15000 to desired ms
```

## 📝 License

MIT - The Beacon © 2025
