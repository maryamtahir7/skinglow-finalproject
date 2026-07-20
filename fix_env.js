import fs from 'fs';

const envPath = '.env';
const content = fs.readFileSync(envPath, 'utf8');

// replace bad characters and strip quotes from DATABASE_URL
let lines = content.split(/\r?\n/);
let newLines = [];
for (let line of lines) {
    if (line.startsWith('DATABASE_URL=')) {
        newLines.push('DATABASE_URL=postgresql://neondb_owner:npg_kRMu4ly0GbXP@ep-sparkling-star-avulwse9-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require');
    } else {
        newLines.push(line);
    }
}

fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');
console.log('Fixed .env file');
