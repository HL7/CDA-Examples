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

# Helpful Scripts
The following scripts are helpful when making structural changes to the IG:

- `node scripts/generatePages.js` - Run after modifying groupings to update the IG's pages field, create new pagecontent entries, and update the menu