const express = require('express');
// Use Axios for HTTP requests
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5176;

// Add a simple health check endpoint first
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/countries', async (req, res) => {
  try {
    console.log("Fetching countries data from https://hantavirus.one/data/countries.json...");
    const response = await axios.get('https://hantavirus.one/data/countries.json');
    const data = response.data;
    console.log("Fetched countries data:", data.length, "countries");
    res.json(data);
  } catch (error) {
    console.error('Error fetching countries data:', error.message);
    console.error('Error stack:', error.stack);
    // Return proper error response instead of fallback data
    res.status(500).json({
      error: 'Failed to fetch countries data',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});