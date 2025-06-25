const fs = require('fs');
const path = require('path');
const validator = require('cda-schematron-validator')

// Tests that cda-schematron-validation can't handle yet
const knownIgnoredTests = [
  'current()',
  'voc.xml'
];

const filenameFilter = process.argv[2];
const schematron = fs.readFileSync('ccda-2-1.sch', 'utf8');
const header = `
   _____       _____ _____            ___   __               
  / ____|     / ____|  __ \\   /\\     |__ \\ /_ |              
 | |   ______| |    | |  | | /  \\       ) | | |              
 | |  |______| |    | |  | |/ /\\ \\     / /  | |              
 | |____     | |____| |__| / ____ \\   / /_ _| |              
  \\_____|     ______|_____/_/    \\_\\ |____(_)_|              
  / ____|    | |                        | |                  
 | (___   ___| |__   ___ _ __ ___   __ _| |_ _ __ ___  _ __  
  \\___ \\ / __| '_ \\ / _ \\ '_ \` _ \\ / _\` | __| '__/ _ \\| '_ \\ 
  ____) | (__| | | |  __/ | | | | | (_| | |_| | | (_) | | | |
 |_____/ \\___|_| |_|\\___|_| |_| |_|\\__,_|\\__|_|  \\___/|_| |_|
`;

console.log(header);
console.log(filenameFilter ? `Validating example files matching: ${filenameFilter}` : 'Validating all sample files (pass in a string to filter files)');

if (!schematron) {
  console.error('Error: Schematron file not found. Please ensure ccda-2-1.sch is in the current directory.');
  process.exit(1);
}

const inputDir = path.join(__dirname, 'input', 'examples');
if (!fs.existsSync(inputDir)) {
  console.error(`Error: Input directory ${inputDir} does not exist. Please ensure the input/examples directory is present.`);
  process.exit(1);
}

const files = fs.readdirSync(inputDir);
const xmlFiles = files.filter(file => file.endsWith('.xml') && (!filenameFilter || file.includes(filenameFilter)));
xmlFiles.forEach(validateFile);
console.info(`Watching for changes in ${inputDir}... (press 'q' to stop)`);
const watcher = fs.watch(inputDir, (eventType, filename) => {
  if (eventType === 'change' && filename.endsWith('.xml') && (!filenameFilter || filename.includes(filenameFilter))) {
    console.log(`Revalidating...`);
    validateFile(filename);
  }
});

// Allow user to stop watching by pressing 'q'
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (key) => {
  if (key === 'q') {
    console.log('Stopping watch⌚ mode and exiting...');
    watcher.close();
    process.exit(0);
  }
});

function validateFile(file) {
  const filePath = path.join(inputDir, file);
  try {
    const data = fs.readFileSync(filePath, 'utf8');

    validator.clearCache();
    const results = validator.validate(data, schematron);
    results.ignored = results.ignored.filter(i => !knownIgnoredTests.find(search => i.test.includes(search)));
    results.ignored.forEach(i => {
      console.warn(`Ignored test: ${i.test} in file ${file}`);
    });

    if (results.errors.length === 0) {
      console.log(`✅ ${file}`);
    } else {
      console.error(`❌ ${file}`, results.errors);
    }
    // Do something with the XML data
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
  }
}