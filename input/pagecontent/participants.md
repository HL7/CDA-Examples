Participation in Clinical Document Architecture (CDA) documents can be complex since multiple roles can be played by the same person. In such cases, the person should be identified for each appropriate participation. Within CDA documents there are four participant types common to any clinical section or entry (i.e. act types of `<act>`, `<encounter>`, `<observation>`, `<procedure>`, and `<substanceAdministration>`). The following four participant types are shown with a definition from CDA R2.0 standard: 

- `<author>` Represents the humans and/or machines that authored the [document/section/entry/act]. 
- `<performer>` A person who actually and principally carries out an action.
- `<informant>` An informant (or source of information) is a person that provides relevant information, such as the parent of a comatose patient who describes the patient's behavior prior to the onset of coma.
- `<participant>` Used to represent other participants not explicitly mentioned by other classes, that were somehow involved in the documented activities

The usage of `<author>` is often required within clinical documents to meet data provenance requirements for certified health information technology. The specific `<templateId root=“2.16.840.1.113883.10.20.22.5.6” />` may be used when an author is conformant to the [Author Provenance](http://hl7.org/cda/us/ccda/StructureDefinition/ProvenanceAuthorParticipation) template. For more information on data provenance, see [USCDI requirements](https://www.healthit.gov/isa/uscdi-data/provenance#uscdi-v1).

The following tables provide informative guidance for what different participants may mean within different sections of a C-CDA document. This was created as part of a C-CDA 2020 Implement-a-thon and reviewed by the CDA Examples Task Force operating under the guidance of the HL7 Structured Documents Working Group in 2021. 

<table class="grid">
  <thead>
    <tr>
      <th>Entries in Each Clinical Domain</th>
      <th>Performer</th>
      <th>Author</th>
      <th>Informant</th>
      <th>Participant</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Allergies</td>
      <td>Who diagnosed</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>The allergen</td>
    </tr>
    <tr>
      <td>Encounters</td>
      <td>Who performs</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>Where performed</td>
    </tr>
    <tr>
      <td>Immunizations &amp; Medications</td>
      <td colspan="4"><em>See details on next table</em></td>
    </tr>
    <tr>
      <td>Payers</td>
      <td>Payer, or Guarantor</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>Member, patient or subscriber</td>
    </tr>
    <tr>
      <td>Planned Activity or Observation</td>
      <td>Who plans to perform</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td></td>
    </tr>
    <tr>
      <td>Problems</td>
      <td>Who diagnosed</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td></td>
    </tr>
    <tr>
      <td>Procedures</td>
      <td>Who performs (e.g. surgeon)</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>Device &amp; where performed</td>
    </tr>
    <tr>
      <td>Results</td>
      <td>Who performs (e.g. lab or imaging center)</td>
      <td>Who composed the record or who provides interpretation/reading</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td></td>
    </tr>
    <tr>
      <td>Vital Signs</td>
      <td>Who performs</td>
      <td>Who composed the record</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td></td>
    </tr>
  </tbody>
</table>

**Additional Detail on Medication (or Immunization) Scenarios**
<table class="grid">
  <thead>
    <tr>
      <th>Entries in Each Clinical Domain</th>
      <th>Performer<sup>*</sup></th>
      <th>Author</th>
      <th>Informant</th>
      <th>Participant</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>New Medication (or existing)</strong><br/>Medications, Planned<br/>moodCode="INT"</td>
      <td>Who will administer a medication (often omitted)</td>
      <td>The prescriber(s). May also be who composed the record with use of functionCode.</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>A vehicle for drug administration (e.g. Normal Saline)</td>
    </tr>
    <tr>
      <td><strong>Ongoing Medication</strong><br/>moodCode="INT"</td>
      <td>Who has and/or will administer a medication (often omitted)</td>
      <td>The prescriber(s). May also be who composed the record with use of functionCode.</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>A vehicle for drug administration (e.g. Normal Saline)</td>
    </tr>
    <tr>
      <td><strong>Past Medication</strong><br/>(may be one-time, discontinued or patient reported)<br/>moodCode="EVN"</td>
      <td>Who has administered</td>
      <td>The past prescriber(s). May also be who composed the record with use of functionCode.</td>
      <td>Other information source (e.g. patient or guardian)</td>
      <td>A vehicle for drug administration (e.g. Normal Saline)</td>
    </tr>
  </tbody>
</table>

<sup>*</sup> To document pharmacy information within a medication activity, use a performer within the following sub-templates: 

- IF NEW OR ONGOING MEDICATION (moodCode=”INT”): The ttp://hl7.org/cda/us/ccda/StructureDefinition/MedicationSupplyOrder template, where a prescription was sent h
- IF ONGOING OR PAST MEDICATION (moodCode=”EVN”): The [Medication Dispense](http://hl7.org/cda/us/ccda/StructureDefinition/MedicationDispense) template, where the prescription was dispensed 