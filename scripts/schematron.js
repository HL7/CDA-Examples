const fs = require('fs');
const path = require('path');
const { loadSchematron, validateXml } = require('./schematronValidation');


const schematronData = {
  '2.1': {
    fileName: 'ccda-2-1.sch',
    contents: null,
    parsedMap: null,
    header: `
 ██████╗    ██╗
 ╚════██╗  ███║
  █████╔╝  ╚██║
 ██╔═══╝    ██║
 ███████╗██╗██║
 ╚══════╝╚═╝╚═╝`
  },
  '3.0': {
    fileName: 'ccda-3-0.sch',
    contents: null,
    parsedMap: null,
    header: `
██████╗     ██████╗ 
╚════██╗   ██╔═████╗
 █████╔╝   ██║██╔██║
 ╚═══██╗   ████╔╝██║
██████╔╝██╗╚██████╔╝
╚═════╝ ╚═╝ ╚═════╝`
  },
  '4.0': {
    fileName: 'ccda-4-0.sch',
    contents: null,
    parsedMap: null,
    header: `
██╗  ██╗    ██████╗ 
██║  ██║   ██╔═████╗
███████║   ██║██╔██║
╚════██║   ████╔╝██║
     ██║██╗╚██████╔╝
     ╚═╝╚═╝ ╚═════╝`
  }
};

const filenameFilter = Object.keys(schematronData).includes(process.argv[2]) ? process.argv[3] : process.argv[2] || null;

// TextToASCII Font ANSI Shadow
const headerBase = `
 ██████╗        ██████╗██████╗  █████╗    
██╔════╝       ██╔════╝██╔══██╗██╔══██╗   
██║     █████╗ ██║     ██║  ██║███████║   
██║     ╚════╝ ██║     ██║  ██║██╔══██║   
╚██████╗       ╚██████╗██████╔╝██║  ██║   
 ╚═════╝        ╚═════╝╚═════╝ ╚═╝  ╚═╝   
      
███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗ ████████╗██████╗  ██████╗ ███╗   ██╗
██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗████╗  ██║
███████╗██║     ███████║█████╗  ██╔████╔██║███████║   ██║   ██████╔╝██║   ██║██╔██╗ ██║
╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║   ██║██║╚██╗██║
███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║╚██████╔╝██║ ╚████║
╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝`;

const headerDash = `
        
        
 █████╗ 
 ╚════╝ `;

const version = Object.keys(schematronData).includes(process.argv[2]) ? process.argv[2] : '2.1';

if (!loadSchematron(version)) {
  console.error(`Error loading schematron for version ${version}.`);
  process.exit(1);
}

// TODO - add dash and range when we do more simultaneously!
const header = headerBase.split('\n').map((base, index) => base + (schematronData[version].header.split('\n')[index] || '')).join('\n');

console.log(header);
console.log(filenameFilter ? `Validating example files matching: ${filenameFilter}` : 'Validating all sample files (pass in a string to filter files)');

const inputDir = path.join(__dirname, '..', 'input', 'examples');
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
  if (key === 'q' || key === '\u0003') { // 'q' or Ctrl+C
    console.log('Stopping watch⌚ mode and exiting...');
    watcher.close();
    process.exit(0);
  }
});

function validateFile(file) {
  const filePath = path.join(inputDir, file);
  try {
    const data = fs.readFileSync(filePath, 'utf8');

    const results = validateXml(version, data);

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