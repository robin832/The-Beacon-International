// Vercel Serverless Function for Monday.com data
// File: /api/survey-data.js

const BOARD_ID = "8670560706";

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  // Get API token from environment
  const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;
  
  if (!MONDAY_API_TOKEN) {
    return res.status(500).json({ 
      error: 'MONDAY_API_TOKEN not configured',
      hint: 'Add MONDAY_API_TOKEN to Vercel Environment Variables'
    });
  }

  try {
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

    const data = await response.json();

    if (data.errors) {
      console.error('Monday.com API errors:', data.errors);
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

      // Extract consent (checkbox) - "v" or "✓" when checked
      const consentValue = columns['boolean07mvgyyk']?.text || '';
      const consent = consentValue === 'v' || consentValue === '✓';

      return {
        id: item.id,
        company,
        opportunities,
        consent
      };
    });

    return res.status(200).json({ 
      items,
      count: items.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
