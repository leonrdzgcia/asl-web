const fs = require('fs');
const path = require('path');

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatBuildTimestamp(date) {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

function main() {
  const now = new Date();
  const buildTimestamp = formatBuildTimestamp(now);

  const outputPath = path.join(
    process.cwd(),
    'src',
    'environments',
    'build-info.ts'
  );

  const fileContent = `export const buildInfo = {\n  buildTimestamp: '${buildTimestamp}'\n};\n`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`Build timestamp generado: ${buildTimestamp}`);
}

main();
