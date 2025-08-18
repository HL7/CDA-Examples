This guide is continually updated as new examples are added or refined and approved by the Structured Documents workgroup. This page serves as a record of major changes in the history of the guide.

### 1.0.0 - Initial Release, August 2005

The majority of content in the initial release was built via an automatic migration from the old [C-CDA Examples repository](https://github.com/HL7/C-CDA-Examples) into this IG.

All files (with few exceptions) were copied directly into the IG with minimal content changes:
- Grouping was set to the original folder name
- Example filename was set to a `kebab-case` form of the original example name (i.e. "Not Allergic to Peanuts" became "allergies-not-allergic-to-peanuts")
- All namespace declarations (`xmlns="urn:hl7-org:v3"`, and `xmlns:xsi=...` and `xmlns:sdtc=...`) were moved to the root element
- Superfluous `<structuredBody>` and `<component>` were removed from examples that start from `<section>`
- Cleaned up some bad XML characters like "pretty" quotes and nonprintable control characters
- Consistent formatting applied to all examples (e.g. 2-space indentation, maximum line lengths)
- Descriptions were set from the `Readme.md` files
- Associated profiles were set by parsing the templateIds from the `Readme.md` files
- Approval status and dates were set by parsing strings in the `Readme.md` files

The following examples were NOT brought over via automatic process:
- Any example with `Approval Status: Withdrawn` in the `Readme.md` file
- Any example missing an `.xml` file (e.g. Medication Timing notes). These were all brought over manually, cleaned up for Markdown / HTML formatting, and listed under the Guidance menu.
- Guide Examples - These are already in the [C-CDA](https://hl7.org/cda/stds/core) implementation guide, though will likely be migrated here in a future version
- Full-Document Examples
- Stylesheets
- A few examples that led to identified issues with the SD publication of C-CDA or CDA as listed below:
  - Period elements with overridden `xsi:type="IVL_PQ"` - currently crashes the publisher
    - `Med every 4-6 hours`
    - `Med oral liquid PRN`

A few samples were modified manually after initial migration
- TemplateIds from the Companion Guide, C-CDA 3.0, and beyond were added
- Nullified addr and telecom fields were added to author elements where required
- Procedure act and observation examples were all migrated to use `<procedure>`
- Various CDA schema errors and C-CDA schematron errors were corrected
- Immunization Not Given updated with code -> value for C-CDA 3.0