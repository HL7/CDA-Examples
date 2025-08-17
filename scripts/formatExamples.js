const fs = require('fs');
const path = require('path');
const { prettyCDA } = require('./prettyCDA');
const { execSync } = require('child_process');

const option = process.argv[2];
if (!option) {
  console.error('Usage: node formatExamples.js <filename> or "staged" or "all"');
  process.exit(1);
}


let files = [];
if (option === 'staged') {
  const gitRoot = execSync('git rev-parse --show-toplevel').toString().trim();
  const stagedFiles = execSync('git diff --cached --name-only').toString().split('\n');
  files = stagedFiles
    .filter(f => f.startsWith('input/examples/') && f.endsWith('.xml'))
    .map(f => path.join(gitRoot, f));
  if (files.length === 0) {
    console.log('No staged XML files found under input/examples.');
    process.exit(0);
  }
  console.log(`Formatting ${files.length} staged XML files...`);
} else if (option === 'all') {
  const examplesDir = path.join(__dirname, '../input/examples');
  files = fs.readdirSync(examplesDir)
    .filter(f => f.endsWith('.xml'))
    .map(f => path.join(examplesDir, f));
} else {
  files = [path.join(__dirname, `../input/examples/${option}.xml`)];
}

let filesModified = false;
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    process.exit(1);
  }
  const xmlString = fs.readFileSync(file, 'utf8');
  const formattedExample = prettyCDA(xmlString);

  if (xmlString !== formattedExample) {
    fs.writeFileSync(file, formattedExample, 'utf8');
    filesModified = true;
    console.warn(`Formatted: ${file}.`)
  }
  // For now, just pause
  //execSync(`git add ${file}`); // Stage the formatted file
}

if (filesModified && option === 'staged') {
  console.warn('Some files were modified. Please review the changes before committing.');
  console.warn('If you do not want to commit the modified files, run `git commit -no-verify` to skip the pre-commit hook.');
  process.exit(1);
}