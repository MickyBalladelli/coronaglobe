// Vercel Serverless Function for countries API endpoint
import axios from 'axios';

export default async function handler(req, res) {
  try {
    console.log("Fetching countries data from https://hantavirus.one/data/countries.json...");
    const response = await axios.get('https://hantavirus.one/data/countries.json');
    const data = response.data;
    console.log("Fetched countries data:", data.length, "countries");
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching countries data:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      error: 'Failed to fetch countries data',
      message: error.message
    });
  }
}

// Optional: Set the API route to be a GET request
export const config = {
  api: {
    externalResolver: true,
  },
};