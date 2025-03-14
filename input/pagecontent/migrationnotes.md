The following are notes about the status of migrating all examples from the old [https://github.com/HL7/C-CDA-Examples](C-CDA Examples repository) into this IG.

All files (with the following exceptions) were copied directly into the IG with minimal content changes:
- Grouping was set to the original folder name
- Example filename was set to a `kebab-case` form of the original example name (i.e. "Not Allergic to Peanuts" became "allergies-not-allergic-to-peanuts")
- All namespace declarations (`xmlns="urn:hl7-org:v3"`, and `xmlns:xsi=...` and `xmlns:sdtc=...` were moved to the root element)
- Superfluous `<structuredBody>` and `<component>` were removed from examples that start from `<section>`
- Cleaned up some bad XML characters like "pretty" quotes and nonprintable control characters
- Tabs and 4-space indents were replaced with 2-space indents
- Descriptions were set from the `Readme.md` files
- Associated profiles were set by parsing the templateIds from the `Readme.md` files

The following examples were NOT brought over via automatic process:
- Any example with `Approval Status: Withdrawn` in the `Readme.md` file
- Any example missing an `.xml` file (e.g. Medication Timing notes). These will be brought over as narrative guidance pages
- Full Document Examples
- Guide Examples
- Stylesheets
- A few examples that led to identified issues with the SD publication of C-CDA or CDA as listed below:
  - Period elements with overridden `xsi:type="IVL_PQ"` - currently crashes the publisher
    - `Med every 4-6 hours`
    - `Med oral liquid PRN`
  - `xsi:type="IVL_INT"` is currently not supported in `Observation.value`
    - `Patient Health Questionnaire PHQ-9`
