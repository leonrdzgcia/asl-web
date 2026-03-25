const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const sourceIconsRoot = path.join(
  projectRoot,
  'node_modules',
  '@material-design-icons',
  'svg',
  'two-tone'
);
const targetIconsRoot = path.join(
  srcRoot,
  'assets',
  'img',
  'icons',
  'material-design-icons',
  'two-tone'
);

function walk(dir, extensions, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, extensions, out);
      continue;
    }

    if (extensions.includes(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }

  return out;
}

function extractUsedIcons(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const iconRegex = /mat:([A-Za-z0-9_]+)/g;
  const icons = [];
  let match = iconRegex.exec(content);

  while (match !== null) {
    icons.push(match[1]);
    match = iconRegex.exec(content);
  }

  return icons;
}

function resetFolder(folderPath) {
  fs.rmSync(folderPath, { recursive: true, force: true });
  fs.mkdirSync(folderPath, { recursive: true });
}

function copyIcon(iconName) {
  const source = path.join(sourceIconsRoot, `${iconName}.svg`);
  const target = path.join(targetIconsRoot, `${iconName}.svg`);

  if (!fs.existsSync(source)) {
    return { iconName, copied: false };
  }

  fs.copyFileSync(source, target);
  return { iconName, copied: true };
}

function main() {
  if (!fs.existsSync(sourceIconsRoot)) {
    console.error('No se encontro la libreria de iconos en node_modules.');
    console.error('Ejecuta npm install antes de sincronizar iconos.');
    process.exit(1);
  }

  const sourceFiles = walk(srcRoot, ['.ts', '.html']);
  const usedIcons = new Set();

  for (const filePath of sourceFiles) {
    const icons = extractUsedIcons(filePath);
    for (const icon of icons) {
      usedIcons.add(icon);
    }
  }

  resetFolder(targetIconsRoot);

  const sortedIcons = Array.from(usedIcons).sort();
  const missingIcons = [];

  for (const iconName of sortedIcons) {
    const result = copyIcon(iconName);
    if (!result.copied) {
      missingIcons.push(iconName);
    }
  }

  console.log(`Iconos detectados en codigo: ${sortedIcons.length}`);
  console.log(`Iconos copiados a assets: ${sortedIcons.length - missingIcons.length}`);

  if (missingIcons.length > 0) {
    console.warn(`Iconos no encontrados en two-tone: ${missingIcons.length}`);
    console.warn(missingIcons.join(', '));
  }
}

main();
