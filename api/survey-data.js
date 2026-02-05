// Vercel Serverless Function for Monday.com data
// File: /api/survey-data.js

const BOARD_ID = "8670560706";

// Simple in-memory cache (resets on cold start)
let cache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL = 30000; // 30 seconds

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  try {
    // Get API token from environment
    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;

    if (!MONDAY_API_TOKEN) {
      return res.status(500).json({
        error: 'MONDAY_API_TOKEN not configured',
        hint: 'Add MONDAY_API_TOKEN to Vercel Environment Variables'
      });
    }

    // Check cache first
    const now = Date.now();
    if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
      return res.status(200).json(cache.data);
    }

    const query = `
      query {
        boards(ids: [${BOARD_ID}]) {
          items_page(limit: 500) {
            items {
              id
              name
              column_values {
                id
                text
                value
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN,
        'API-Version': '2024-01'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      console.error('Monday.com HTTP error:', response.status);
      // Return cached data if available
      if (cache.data) {
        return res.status(200).json({ ...cache.data, cached: true });
      }
      return res.status(response.status).json({
        error: `Monday.com returned ${response.status}`
      });
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Monday.com API errors:', data.errors);
      // Return cached data if available
      if (cache.data) {
        return res.status(200).json({ ...cache.data, cached: true });
      }
      return res.status(500).json({
        error: 'Failed to fetch from Monday.com',
        details: data.errors
      });
    }

    // Process the items
    const rawItems = data.data?.boards?.[0]?.items_page?.items || [];

    const items = rawItems.map(item => {
      const columns = {};
      item.column_values.forEach(col => {
        columns[col.id] = col;
      });

      // Extract opportunities from dropdown
      const dropdownText = columns['dropdown_mknydrxj']?.text || '';
      const opportunities = dropdownText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Extract company name
      const company = columns['text_mknzjpxx']?.text || '';

      return {
        id: item.id,
        company,
        opportunities
      };
    });

    const result = {
      items,
      count: items.length,
      lastUpdated: new Date().toISOString()
    };

    // Update cache
    cache = {
      data: result,
      timestamp: now
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Survey API Error:', error.name, error.message);

    // Return cached data if available
    if (cache.data) {
      return res.status(200).json({ ...cache.data, cached: true });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      name: error.name
    });
  }
};
