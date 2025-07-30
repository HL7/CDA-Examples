const fs = require('fs');
const validator = require('cda-schematron-validator')

const supportedVersions = ['2.1', '3.0', '4.0'];

// Tests that cda-schematron-validation can't handle yet
const knownIgnoredTests = [
  'current()',
  'voc.xml',
  'not(@extension)', // https://jira.hl7.org/browse/CDA-21367
  'count(sdtc:category)=1', // https://jira.hl7.org/browse/CDA-21383
];

const skippedAssertions = [
  'a-1098-30784-v',  // This is a warning which the schematron validator treats as an error
  'a-4515-30784-v'
];

// Map of version to schematron file and parsedMap
const loadedMaps = new Map();

function loadSchematron(version) {
  if (!supportedVersions.includes(version)) {
    throw new Error(`Unsupported schematron version: ${version}. Supported versions are: ${supportedVersions.join(', ')}`);
  }
  if (loadedMaps.has(version)) {
    return loadedMaps.get(version);
  }

  try {
    let contents = fs.readFileSync(`ccda-${version}.sch`, 'utf8');

    // Quick fix since cda-schematron-validator doesn't handle variables, and I can't work on that right now
    const matches = Array.from(contents.matchAll(/<let name="([\w_]+)" value="('[^'"]+')"\/>/g));
    for (const variable of matches) {
      contents = contents.replaceAll(`($${variable[1]},`, `(${variable[2]},`);
    }
  
    loadedMaps.set(version, {
      contents,
      parsedMap: null // Not calling validator.parseSchematron(contents) because that requires a parsed DOM object *sigh*
    });
    return loadedMaps.get(version);
  } catch (error) {
    console.error(`Error loading schematron for version ${version}. Please ensure 'ccda-${version}.sch' exists in the current directory.`, error);
    return false;
  }
}

function validateXml(version, xml) {
  const schematron = loadSchematron(version);
  if (!schematron) {
    console.error(`Schematron for version ${version} not loaded.`);
    return false;
  }

  validator.clearCache();
  const options = {
    parsedSchematronMap: schematron.parsedMap
  }
  const results = validator.validate(xml, schematron.contents, options);
  schematron.parsedMap = options.schematronMap;

  // Filter out known ignored tests
  results.ignored = results.ignored.filter(i => !knownIgnoredTests.find(search => i.test.includes(search)));
  results.ignored.forEach(i => {
    console.warn(`Ignored test: ${i.test} in file ${file}`);
  });
  results.errors = results.errors
    .filter(e => !knownIgnoredTests.find(search => e.test.includes(search)))
    .filter(e => !skippedAssertions.includes(e.assertionId));

  return results;
}

module.exports = {
  loadSchematron,
  validateXml
}