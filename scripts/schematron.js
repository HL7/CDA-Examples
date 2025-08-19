const fs = require('fs');
const path = require('path');
const { loadSchematron, validateXml } = require('./schematronValidation');

const schematrons = {
  '2.1': {
    fileName: 'ccda-2.1.sch',
    icon: '2️⃣'
  },
  '3.0': {
    fileName: 'ccda-3.0.sch',
    icon: '3️⃣'
  },
  '4.0': {
    fileName: 'ccda-4.0.sch',
    icon: '4️⃣'
  },
};

const modeHeaders = {
  '2.1': `
 ██████╗        ██████╗██████╗  █████╗     ██████╗    ██╗
██╔════╝       ██╔════╝██╔══██╗██╔══██╗    ╚════██╗  ███║
██║     █████╗ ██║     ██║  ██║███████║     █████╔╝  ╚██║
██║     ╚════╝ ██║     ██║  ██║██╔══██║    ██╔═══╝    ██║
╚██████╗       ╚██████╗██████╔╝██║  ██║    ███████╗██╗██║
 ╚═════╝        ╚═════╝╚═════╝ ╚═╝  ╚═╝    ╚══════╝╚═╝╚═╝`
  ,
  '3.0': `
 ██████╗        ██████╗██████╗  █████╗    ██████╗     ██████╗
██╔════╝       ██╔════╝██╔══██╗██╔══██╗   ╚════██╗   ██╔═████╗
██║     █████╗ ██║     ██║  ██║███████║    █████╔╝   ██║██╔██║
██║     ╚════╝ ██║     ██║  ██║██╔══██║    ╚═══██╗   ████╔╝██║
╚██████╗       ╚██████╗██████╔╝██║  ██║   ██████╔╝██╗╚██████╔╝
 ╚═════╝        ╚═════╝╚═════╝ ╚═╝  ╚═╝   ╚═════╝ ╚═╝ ╚═════╝`
  ,
  '4.0': `
 ██████╗        ██████╗██████╗  █████╗    ██╗  ██╗    ██████╗
██╔════╝       ██╔════╝██╔══██╗██╔══██╗   ██║  ██║   ██╔═████╗
██║     █████╗ ██║     ██║  ██║███████║   ███████║   ██║██╔██║
██║     ╚════╝ ██║     ██║  ██║██╔══██║   ╚════██║   ████╔╝██║
╚██████╗       ╚██████╗██████╔╝██║  ██║        ██║██╗╚██████╔╝
 ╚═════╝        ╚═════╝╚═════╝ ╚═╝  ╚═╝        ╚═╝╚═╝ ╚═════╝`
  ,
  'all': `
 ██████╗        ██████╗██████╗  █████╗     ██████╗    ██╗        ██╗  ██╗    ██████╗
██╔════╝       ██╔════╝██╔══██╗██╔══██╗    ╚════██╗  ███║        ██║  ██║   ██╔═████╗
██║     █████╗ ██║     ██║  ██║███████║     █████╔╝  ╚██║ █████╗ ███████║   ██║██╔██║
██║     ╚════╝ ██║     ██║  ██║██╔══██║    ██╔═══╝    ██║ ╚════╝ ╚════██║   ████╔╝██║
╚██████╗       ╚██████╗██████╔╝██║  ██║    ███████╗██╗██║             ██║██╗╚██████╔╝
 ╚═════╝        ╚═════╝╚═════╝ ╚═╝  ╚═╝    ╚══════╝╚═╝╚═╝             ╚═╝╚═╝ ╚═════╝`
};

const filenameFilter = Object.keys(modeHeaders).includes(process.argv[2]) ? process.argv[3] : process.argv[2] || null;

// TextToASCII Font ANSI Shadow
const headerBase = `
███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗ ████████╗██████╗  ██████╗ ███╗   ██╗
██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗████╗  ██║
███████╗██║     ███████║█████╗  ██╔████╔██║███████║   ██║   ██████╔╝██║   ██║██╔██╗ ██║
╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║   ██║██║╚██╗██║
███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║╚██████╔╝██║ ╚████║
╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝`;

const version = Object.keys(schematrons).includes(process.argv[2]) ? process.argv[2] : 'all';
const versions = version === 'all' ? Object.keys(schematrons) : [version];

for (const versionToLoad of versions) {
  if (!loadSchematron(schematrons[versionToLoad].fileName, versionToLoad)) {
    console.error(`Error loading schematron for version ${versionToLoad}.`);
    process.exit(1);
  }
}

console.log(modeHeaders[version]);
console.log(headerBase);
console.log(filenameFilter ? `Validating example files matching: ${filenameFilter}` : 'Validating all sample files (pass in a string to filter files)');

const inputDir = path.join(__dirname, '..', 'input', 'examples');
if (!fs.existsSync(inputDir)) {
  console.error(`Error: Input directory ${inputDir} does not exist. Please ensure the input/examples directory is present.`);
  process.exit(1);
}

const files = fs.readdirSync(inputDir);
const xmlFiles = files.filter(file => file.endsWith('.xml') && (!filenameFilter || file.includes(filenameFilter)));
printVersionNumbers();
xmlFiles.forEach(validateFile);
console.info(`Watching for changes in ${inputDir}... (press 'q' to stop)`);
let watchTimeout;
const delay = 300;
const watcher = fs.watch(inputDir, (eventType, filename) => {
  clearTimeout(watchTimeout);
  watchTimeout = setTimeout(() => {
    if (eventType === 'change' && filename.endsWith('.xml') && (!filenameFilter || filename.includes(filenameFilter))) {
      console.log(`File changed: ${filename}. Revalidating...`);
      printVersionNumbers();
      validateFile(filename);
    }
  }, delay);
});

// Allow user to stop watching by pressing 'q'
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (key) => {
  if (key === 'q' || key === '\u0003') { // 'q' or Ctrl+C
    console.log('Stopping watch⌚ mode and exiting...');
    watcher.close();
    process.exit(0);
  }
});

function printVersionNumbers() {
  if (versions.length === 1) return;
  console.log(versions.map(version => schematrons[version].icon).join('  '));
}

function validateFile(file) {
  const filePath = path.join(inputDir, file);
  try {
    const data = fs.readFileSync(filePath, 'utf8');

    const results = versions.map(version => ({
      ...validateXml(version, data),
      version
    }));
    
    const icons = results.map(result => {
      if (!result) return '❌';
      if (result.errors.length === 0) return '✅';
      return '❌';
    });

    console.log(`${icons.join(' ')} ${file}`);
    if (!results) return;

    for (const result of results) {
      if (!result) continue;
      if (result.errors.length > 0) {
        if (versions.length > 1) console.log(`From Version ${result.version}:`);
        console.log(result.errors);
      }
    }
    // Do something with the XML data
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
  }
}