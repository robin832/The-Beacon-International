// Vercel Serverless Function for Monday.com data
// File: /api/survey-data.js

export const config = {
  runtime: 'edge',
};

const BOARD_ID = "8670560706";

export default async function handler(request) {
  // Get API token from environment
  const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;
  
  if (!MONDAY_API_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'MONDAY_API_TOKEN not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
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
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Monday.com', details: data.errors }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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

    return new Response(
      JSON.stringify({ 
        items,
        count: items.length,
        lastUpdated: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
