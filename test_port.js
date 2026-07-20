import http from 'http';
const server = http.createServer((req, res) => res.end('OK'));
server.listen(8085, () => console.log('Listening on 8085'));
server.on('error', console.error);
