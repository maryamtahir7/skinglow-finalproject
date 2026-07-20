import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables manually with a more robust parser
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '').trim();
            process.env[key.trim()] = value;
        }
    });
    console.log('✅ Loaded .env variables');
}

const PORT = process.env.PORT || 8085;

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const apiPath = parsedUrl.pathname;

    console.log(`\nIncoming request: ${req.method} ${apiPath}`);

    if (apiPath.startsWith('/api/')) {
        const fileName = apiPath.replace('/api/', '') + '.js';
        const filePath = path.join(__dirname, 'api', fileName);

        if (fs.existsSync(filePath)) {
            try {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', async () => {
                    try {
                        req.body = body ? JSON.parse(body) : {};
                        console.log('Request body:', req.body);
                    } catch (e) {
                        console.warn('Failed to parse JSON body');
                        req.body = {};
                    }

                    const vercelRes = {
                        status: (code) => {
                            res.statusCode = code;
                            console.log(`Response status set to: ${code}`);
                            return vercelRes;
                        },
                        json: (data) => {
                            console.log('Sending response:', data);
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(data));
                            return vercelRes;
                        }
                    };

                    try {
                        const modulePath = `file://${filePath}?t=${Date.now()}`;
                        const { default: handler } = await import(modulePath);
                        await handler(req, vercelRes);
                    } catch (handlerErr) {
                        console.error('Handler execution error:', handlerErr);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Internal Server Error', error: handlerErr.message }));
                    }
                });
            } catch (err) {
                console.error('Core request processing error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ message: 'Fatal Server Error' }));
            }
        } else {
            console.warn(`API Route not found on disk: ${filePath}`);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'API Route Not Found' }));
        }
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `--------------------------------------------------`);
    console.log(`\x1b[32m%s\x1b[0m`, `🚀 Local API Server running at http://localhost:${PORT}`);
    console.log(`\x1b[36m%s\x1b[0m`, `--------------------------------------------------`);
});
