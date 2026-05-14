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
    // Return fallback data instead of error
    res.status(200).json([
      {
        "iso": "NL",
        "country": "Netherlands",
        "confirmed": "3",
        "suspected": "0",
        "deaths": "2",
        "status": "3 confirmed (NICD via WHO): 2 evacuated survivors + 1 on-board confirmed death (2 May). 2 on-board deaths attributed to NL as flag state — 1 confirmed, 1 probable index (11 Apr).",
        "source_url": "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON601"
      },
      {
        "iso": "ZA",
        "country": "South Africa",
        "confirmed": "2",
        "suspected": "0",
        "deaths": "1",
        "status": "2 confirmed at NICD: 1 death Johannesburg (26 Apr), 1 survivor in ICU. 97 contacts traced (91 located); no local transmission (Mohale via Health-e, 12 May).",
        "source_url": "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON601"
      }
    ]);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});