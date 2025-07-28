# CDA-Examples
The CDA Example repository contains examples reviewed and approved by the Structured Document Work Group.

# Validation
All examples are automatically validated against C-CDA 3.0 or later using FHIR Structure Definition validation.

Wherever possible, examples have also been validated against C-CDA 2.1's schematron. This can be done 
manually by executing the following on a local copy of the repository (prereq: [NodeJS](https://nodejs.org))

(Only need to run npm i once)
```sh
npm i
npm run 2.1
```

This will validate all input/examples files against the C-CDA 2.1 schematron with Companion Guide 4.1 additions.

Additional scripts exist to run validation against C-CDA 3.0 and 4.0 schematron (`npm run 3.0` / `npm run 4.0`), though.

**Validating a single file or subset of files**

Pass a single-word (can by dash-delimited) after the version to filter validation to a subset of matching files:

```sh
npm run 2.1 vitals
```

# Adding / Modifying Examples
The majority of XML-based examples consist of 2 parts: the sample XML file itself, and an entry in the ImplementationGuide resource (`hl7.cda.examples.json`). Other guidance and narrative pages are created according to normal FHIR Implementation Guide processes

**Example XML File**

Create or update XML files under `/input/examples/` and name them starting with the grouping (categorization) followed by a unique name in [kebab-case](https://en.wiktionary.org/wiki/kebab_case).

- FHIR validation requires XML to be properly namespaced, so include `xmlns="urn:hl7-org:v3"` on the root element, even if it is not `<ClinicalDocument>`.
- Make sure there are no spaces before the first `<` character on the first line of XML (preceding lines of comments are allowed)
- Indent with 2 spaces for consistency; do not use tabs

After creating the file, it can be validated using the scripts mentioned above (even before it is included in the IG resource).

**Example Definition in IG**
Create or update `definition.resource[]` for the example. Look at other examples as a model, but in general:

- Set 3 required extensions:
  - [implementationguide-resource-format](http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format) - `valueCode: 'application/xml'`
  - [implementationguide-resource-logical](http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-logical) - set `valueCanonical` to the URL of the primary profile corresponding to the root node. (If using a generic Section or other CDA element, this can be a URI from the [Base CDA SD IG](https://hl7.org/cda/stds/core/)) 
  - [ExampleApprovalStatus](StructureDefinition-ExampleApprovalStatus.html) - populate with status and dates of approval
- Set reference to `Binary/{example-xml-file-name-without-extension}`
- Set `isExample` to `true`
- Populate `name` and `description` (markdown allowed, use `\n` for a linebreak)
- Set `groupingId` to one of the groups (defined in same IG file under `definition.grouping[]`)
- Set `profiles[]` to a list of profiles that are represented by this example (*including* the URL specified in the `resource-logical` extension above)

Once set in the IG, run the IG Publisher by executing `_genonce` (either `.bat` for Windows or `.sh` for Mac/Linux) and verify the new example appears as expected.

# Helpful Scripts
The following scripts are helpful when making structural changes to the IG:

- `node scripts/generatePages.js` - Run after modifying groupings to update the IG's pages field, create new pagecontent entries, and update the menu