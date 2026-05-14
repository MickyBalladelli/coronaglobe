const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 5175;

app.get('/api/countries', async (req, res) => {
  try {
    const response = await fetch('https://hantavirus.one/data/countries.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched countries data:", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});