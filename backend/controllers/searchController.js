const axios = require('axios');

exports.searchLocation = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Proxy to Nominatim with India bias
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        q: `${query} India`,
        addressdetails: 1,
        limit: 10,
      },
      headers: {
        'User-Agent': 'IndiaGISApp/1.0',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Search API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
};
