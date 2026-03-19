import fs from 'fs';

const content = fs.readFileSync('c:/Users/Donggyun/.gemini/antigravity/scratch/portfolio-1/src/components/AdminDashboard.tsx', 'utf8');
const lines = content.split('\n');
const declarations = new Map();

lines.forEach((line, i) => {
  const match = line.match(/(const|let|function)\s+(\w+)\s*=/ ) || line.match(/function\s+(\w+)\s*\(/);
  if (match) {
    const name = match[2] || match[1];
    if (declarations.has(name)) {
      console.log(`Duplicate found: ${name} at line ${i + 1} and ${declarations.get(name)}`);
    } else {
      declarations.set(name, i + 1);
    }
  }
});
