CodeSystem: ApprovalStatusCodeSystem
Title: "Example Approval Status"
Description: "Identifies the approval status of an example"
* ^experimental = false
* ^caseSensitive = true
* #draft "Draft" "Example is not yet ready for approval by Structured Documents Workgroup."
* #approved "Approved" "Example has been approved by Structured Documents Workgroup."
* #pending "Pending" "Example is considered complete but has not yet been officially approved by Structured Documents Workgroup."
* #withdrawn "Withdrawn" "Example has been withdrawn from consideration by Structured Documents Workgroup."

ValueSet: ApprovalStatusValueSet
Title: "Example Approval Status"
Description: "Identifies the approval status of an example"
* ^experimental = false
* include codes from system ApprovalStatusCodeSystem

Extension: ExampleApprovalStatus
Title: "Example Approval Status"
Description: "Extension to indicate the approval status of an example"
Context: ImplementationGuide.definition.resource
* obeys approved-date
* extension contains
  status 1..1 and
  sdwgApprovalDate 0..* and
  taskForceApprovalDate 0..*
* extension[status] ^short = "State of approval"
  * value[x] only code
  * value[x] from ApprovalStatusValueSet
  * value[x] ^short = "approved | pending | withdrawn"
* extension[sdwgApprovalDate] ^short = "Date extension approved by Structured Documents Work Group"
  * value[x] only date
* extension[taskForceApprovalDate] ^short = "Date extension approved by Examples Task Force"
  * value[x] only date

Invariant: approved-date
Description: "If the status is approved, then the sdwgApprovalDate and taskForceApprovalDate must be present"
Severity: #error
Expression: "(extension('status').value = 'approved') implies (extension('sdwgApprovalDate').exists() and extension('taskForceApprovalDate').exists())"