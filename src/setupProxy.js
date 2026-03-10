const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STEAMGRIDDB_API_KEY = process.env.REACT_APP_STEAMGRIDDB_API_KEY;

module.exports = function (app) {
  app.use('/api/steamgriddb', async (req, res) => {
    const targetPath = req.url.replace(/^\//, '');
    const targetUrl = `https://www.steamgriddb.com/api/v2/${targetPath}`;

    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Authorization': `Bearer ${STEAMGRIDDB_API_KEY}`,
        },
      });

      const data = await response.text();
      res.status(response.status);
      res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
      res.send(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
