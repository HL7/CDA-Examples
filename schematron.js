const fs = require('fs');
const path = require('path');
const validator = require('cda-schematron-validator')

// Tests that cda-schematron-validation can't handle yet
const knownIgnoredTests = [
  'current()',
  'voc.xml',
  'not(@extension)', // https://jira.hl7.org/browse/CDA-21367
];

const skippedAssertions = [
  'a-1098-30784-v'  // This is a warning which the schematron validator treats as an error
];

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



const schematron = Object.keys(schematronData).includes(process.argv[2]) ? schematronData[process.argv[2]] : schematronData['2.1'];

schematron.contents = fs.readFileSync(schematron.fileName, 'utf8');
if (!schematron.contents) {
  console.error(`Error: Schematron file ${schematron.fileName} not found. Please ensure it is in the current directory.`);
  process.exit(1);
}

// TODO - add dash and range when we do more simultaneously!
const header = headerBase.split('\n').map((base, index) => base + (schematron.header.split('\n')[index] || '')).join('\n');

console.log(header);
console.log(filenameFilter ? `Validating example files matching: ${filenameFilter}` : 'Validating all sample files (pass in a string to filter files)');

// Quick fix since cda-schematron-validator doesn't handle variables, and I can't work on that right now
const matches = Array.from(schematron.contents.matchAll(/<let name="([\w_]+)" value="('[^'"]+')"\/>/g));
for (const variable of matches) {
  schematron.contents = schematron.contents.replaceAll(`($${variable[1]},`, `(${variable[2]},`);
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

    validator.clearCache();
    let options = {
      parsedSchematronMap: schematron.parsedMap
    };
    const results = validator.validate(data, schematron.contents, options);
    schematron.parsedMap = options.schematronMap; // Cache the schematron map for future use
    results.ignored = results.ignored.filter(i => !knownIgnoredTests.find(search => i.test.includes(search)));
    results.ignored.forEach(i => {
      console.warn(`Ignored test: ${i.test} in file ${file}`);
    });
    results.errors = results.errors
      .filter(e => !knownIgnoredTests.find(search => e.test.includes(search)))
      .filter(e => !skippedAssertions.includes(e.assertionId));

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