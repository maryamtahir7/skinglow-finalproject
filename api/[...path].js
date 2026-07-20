// Vercel Serverless Function for API routes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path: routePath } = req.query;
  const fileName = (Array.isArray(routePath) ? routePath.join('/') : routePath) + '.js';
  
  // Construct the path to the API handler
  const handlerPath = path.join(__dirname, 'handlers', fileName);

  try {
    // Check if handler exists
    if (!fs.existsSync(handlerPath)) {
      return res.status(404).json({ message: 'API Route Not Found' });
    }

    // Dynamic import of the handler
    const { default: apiHandler } = await import(`file://${handlerPath}?t=${Date.now()}`);
    
    // Create a mock vercelRes object for compatibility
    const vercelRes = {
      statusCode: 200,
      status: function(code) {
        this.statusCode = code;
        res.statusCode = code;
        return this;
      },
      json: function(data) {
        res.setHeader('Content-Type', 'application/json');
        res.status(this.statusCode).json(data);
        return this;
      },
      send: function(data) {
        res.status(this.statusCode).send(data);
        return this;
      }
    };

    // Call the API handler
    await apiHandler(req, vercelRes);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
