### Mapping CDA v3 actStatus Codes to FHIR Medication Status Codes
In healthcare data exchange, status codes play a critical role in communicating the clinical state of a medication. The HL7 Clinical Document Architecture (CDA) uses v3 actStatus codes to indicate the progress of medication activities. In HL7 FHIR, resources such as MedicationStatement and MedicationAdministration have their own status code systems describing similar concepts.

To support interoperability and enable accurate transformation of data between CDA and FHIR implementations (such as migrating from C-CDA to FHIR), it’s important to map these codes precisely.

The table below provides a mapping between CDA actStatus codes (when moodCode = EVN) and the equivalent FHIR status codes used in MedicationStatement and MedicationAdministration resources. This mapping is informed by guidance from the HL7 Pharmacy Work Group and is intended for use in implementations like C-CDA on FHIR.

| FHIR Code (Human-Readable) | Definition                                                                 | v3 Map (actStatus) | Pharmacy WG Approved |
|----------------------------|----------------------------------------------------------------------------|--------------------|-----------------------------------|
| in progress                | The administration has started but has not yet completed.                  | active             | Yes                               |
| on hold                    | Actions implied by the administration have been temporarily halted, but are expected to continue later. May also be called "suspended". | suspended          | Yes                               |
| completed                  | All actions that are implied by the administration have occurred.         | completed          | Yes                               |
| entered in error           | The administration was entered in error and therefore nullified.          | nullified          | Yes                               |
| stopped                    | Actions implied by the administration have been permanently halted, before all of them occurred. | aborted            | Yes                             |
