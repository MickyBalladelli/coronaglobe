// Vercel Serverless Function for hantavirus API endpoint
// This avoids CORS issues by fetching data server-side
const axios = require('axios');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    console.log("Fetching hantavirus data from https://hantavirus.one/data/countries.json...");
    
    // Make sure we're getting a proper JSON response
    const response = await axios.get('https://hantavirus.one/data/countries.json', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    // Validate response
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid data received from hantavirus.one - not a valid JSON object');
    }
    
    const data = response.data;
    console.log("Fetched hantavirus data:", Array.isArray(data) ? data.length : 'unknown', "items");
    
    // Ensure we're sending proper JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching hantavirus data:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return a more specific error message
    res.status(500).json({
      error: 'Failed to fetch hantavirus data',
      message: error.message,
      url: 'https://hantavirus.one/data/countries.json'
    });
  }
}
