const fs = require('fs');
const validator = require('cda-schematron-validator')

// Tests that cda-schematron-validation can't handle yet
const knownIgnoredTests = [
  'current()',
  'voc.xml',
  'not(@extension)', // https://jira.hl7.org/browse/CDA-21367
];

const skippedAssertions = [
  'a-1098-30784-v',  // This is a warning which the schematron validator treats as an error
  'a-4515-30784-v'
];

// Map of version to schematron file and parsedMap
const loadedMaps = new Map();

/**
 * Load a schematron from a file or the cache
 * @param {*} fileName Filename to load - must be a local .sch file
 * @param {*} versionTag Tag used to identify the file for future validateXml calls. If empty, defaults to fileName.
 * @returns 
 */
function loadSchematron(fileName, versionTag) {
  if (!versionTag) versionTag = fileName;

  if (loadedMaps.has(versionTag)) {
    return loadedMaps.get(versionTag);
  }

  if (!/^[\w.-]+\.sch$/.test(`${fileName}`)) {
    throw new Error(`Invalid schematron filename for version: ${fileName}`);
  }

  try {
    let contents = fs.readFileSync(`${fileName}`, 'utf8');

    // Quick fix since cda-schematron-validator doesn't handle variables, and I can't work on that right now
    const matches = Array.from(contents.matchAll(/<let name="([\w_]+)" value="('[^'"]+')"\/>/g));
    for (const variable of matches) {
      contents = contents.replaceAll(`($${variable[1]},`, `(${variable[2]},`);
    }
  
    loadedMaps.set(versionTag, {
      contents,
      parsedMap: null // Not calling validator.parseSchematron(contents) because that requires a parsed DOM object *sigh*
    });
    return loadedMaps.get(versionTag);
  } catch (error) {
    console.error(`Error loading schematron ${fileName}. Please ensure it exists in the current directory.`, error);
    return false;
  }
}

function validateXml(versionTagOrFilename, xml) {
  const schematron = loadSchematron(versionTagOrFilename);
  if (!schematron) {
    console.error(`Schematron for version ${versionTagOrFilename} not loaded.`);
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