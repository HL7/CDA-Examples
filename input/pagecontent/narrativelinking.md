### How to create narrative text linking in sections that contain machine-processable entries

Narrative text linking is extremely important for processing and validating CDA documents that include machine-processable entries. The linkages act as the mechanism that associate human-readable information in the narrative text of each section to the entries carrying that information for machine processing. Without proper narrative text linking, it is impossible to accurately validate if the machine-readable entries and the human-readable representation of that information accurately reflect the same semantic meaning.

Each reference label is a unique identifier. The label appears in a structural spot within the entry and can be found within the narrative text to indicate where the linkage aligns.

Information in the narrative text element of a section also can be structured. There are simple structuring mechanisms such as paragraph and content tags, and there are more complex structuring mechanisms such as tables and lists. When representing information in the narrative text of a section which is present in machine-processable entries, linking requires a correspondence to be created between the structure of the information in the entries and the structure of the information in the narrative text. 

Clinically relevant and pertinent information present in the entry should be represented in the human readable text unless the meaning has already been addressed contextually. For example, if the author of the section has already been identified, then it would not be necessary to repeat that author’s information if he or she is listed as the author of an entry within that section. Compound entries made up of acts nested within acts may include cardinality choices that need to be taken into consideration.  For example, an entry designed as an act that encompasses one or more observations will need to have a similar structure developed for representing that information in the human readable text. The potential multiplicity of the inner observation needs to be anticipated when planning the pattern for representing the information in a human readable format.

Below are three steps for creating narrative text linking in a CDA document.

### Step 1. Establish a unique label pattern for the entry template
First, review the entry template structure of the entry. Review the entryRelationships, components, references, and preconditions within the entry and take their cardinalities into consideration. For each act within the structure, consider the possible participations and their cardinalities. If the entry design includes recursion, consider how that would be shown (or limited) in the human readable narrative. Also, consider the number of coded concepts in each act which are bound to a value set. For observation acts, consider the value element and how it may be used.

Once you have a good feel for the structure of the entry and a clear understanding of where clinically relevant information will be populated, invent a label pattern that meets these requirements. For example, the Problem Concern Act entry encompasses one or more observation acts used to record the Problem Observation being tracked together as a single concern.  This structure implies that for each Problem Concern Act entry, there can be one or more problem observation.  An appropriate labeling strategy might be:

PC#, where # is an integer that counts each Problem Concern Act entry, followed by Problem#, where n is an integer that counts each Problem Observation.  Together you would have the outer PC# with the inner PC#-Problem# components.  If the Problem Observation supported a single Problem Status, then its label could just be PC#-Problem#-PS.  Or, if the primary act of a Problem Observation included a single coded concept for Problem type, then its label could be PC#-Problem#-type. The examples below demonstrate a variety of labeling approaches.

Label names can be long and readable, or short and cryptic. It doesn’t matter, as long as the labels are unique within the document. Take care if using the acronym + position pattern illustrated above across sections which may have common entry names. Does IN mean Instructions, or Interventions?  Also, consider if the same templates ends up being output in multiple sections causing duplicate ID values. More descriptive labels are preferred.

### Step 2. Place reference label into the structured entries

As a minimum, place a reference label in the text element of the primary Act of the entry.  

Optionally, place a reference label in the text element of subordinate acts within the entry if the subordinate act encompasses multiple data elements such as code, effectiveTime, value, or other coded elements like targetSite, or methodCode, or if the subordinate act encompasses other participations. 
See [General Examples](examples-general.html) which includes an examples for narrative/entry reference for each entry type.

Finally, if the entry includes clinically relevant coded concepts within its structure, place a reference label in that coded element of the entry.

During this step, it helps to involve clinical resources to decide what information is clinically relevant and pertinent to include in the narrative text. 

**A reference label in a text element**
{% highlight xml %}
<encounter>
  ...
  <text><reference value="#PC1"></reference></text>
  ...
</encounter>
{% endhighlight %}

**A reference label in a coded element of an entry**
{% highlight xml %}
<code code="55607006" displayName="Problem"
           codeSystem="2.16.840.1.113883.6.96" codeSystemName="SNOMED CT">
         <originalText><reference value="#PC1problem1Type"></reference></originalText>
</code>
{% endhighlight %}

**A reference label in a observation for a value element that is a coded concept**
{% highlight xml %}
<value xsi:type="CD" code="363746003" codeSystem="2.16.840.1.113883.6.96" codeSystemName="SNOMED CT" displayName="Acute pharyngitis">
          <originalText><reference value="#problem1Value" /></originalText>
</value>
{% endhighlight %}

**A reference label for an additional coded concept data element within an Act**
{% highlight xml %}
<targetSiteCode code="181255000" codeSystem="2.16.840.1.113883.6.96"
		displayName="Entire Appendix" codeSystemName="SNOMED-CT">
	<originalText><reference value="#Procedure1TargetSite"/></originalText>
</targetSiteCode>
{% endhighlight %}

**A reference label for a participation with a coded concept**
{% highlight xml %}
<participant typeCode="CSM">
      <participantRole classCode="MANU">
             <playingEntity classCode="MMAT">
                     <code code="1564HD0N96" displayName="Cat hair"
                                codeSystem="2.16.840.1.113883.4.9" codeSystemName="UNII">
                           <originalText><reference value="#allergy1allergen"/></originalText>
                     </code>
               </playingEntity>
         </participantRole>
 </participant>
{% endhighlight %}

### Step 3. Insert reference labels into appropriate locations in narrative text elements of the section
For each reference label established and placed in the machine-readable entry, find the corresponding location in the representation of the narrative and add an id element to hold the reference label.

**Example with compound “nested acts” entry structure:**
{% highlight xml %}
<text>
  <table>
    <thead>
      <tr>
        <th>Condition</th>
        <th>Monitoring Information</th>
      </tr>
    </thead>
    <tbody>
      <tr ID="PC1">
        <td ID="PC1problem1">
          <content ID="PC1problem1Value">Community Acquired Pneumonia</content>
          (<content ID="PC1problem1Type">Problem</content>)<br/>
          Onset: <content ID="PC1problem1Onset">February 27, 2014</content><br/>
          <content>Heartly Sixer, MD [March 2, 2014]</content>
        </td>
        <td>
          <content>Active Concern</content><br/>
          Monitored since: March 2, 2014<br/>
          Monitored by:<content>Heartly Sixer, MD [March 22, 2014]</content>
        </td>
      </tr>
    </tbody>
  </table>
</text>
<entry typeCode="DRIV">
  <act classCode="ACT" moodCode="EVN">
    <templateId root="2.16.840.1.113883.10.20.22.4.3"/>
    <templateId root="2.16.840.1.113883.10.20.22.4.3" extension="2015-08-01"/>
    <id root="102acae9-884c-4523-a2b4-1bc63469c397"/>
    <code code="CONC" codeSystem="2.16.840.1.113883.5.6"/>
    <text>
      <reference value="#PC1"/>
    </text>
    <!-- Since this is an active problem, the concern status is active. -->
    <!-- While clinicians can track resolved problems, generally active problems
         will have active concern status and resolved concerns will be completed -->
    <statusCode code="active"/>
    <effectiveTime>
      <!-- This equates to the time the concern was authored in the patient's chart.
           This may frequently be an EHR timestamp-->
      <low value="20140302124536-0500"/>
    </effectiveTime>
    <author>
      <templateId root="2.16.840.1.113883.10.20.22.4.119"/>
      <time value="20140322124536"/>
      <assignedAuthor>
        <id extension="66666" root="2.16.840.1.113883.4.6"/>
        <code code="207RC0000X" codeSystem="2.16.840.1.113883.6.101"
              codeSystemName="NUCC" displayName="Cardiovascular Disease"/>
        <addr>
          <streetAddressLine>6666 StreetName St.</streetAddressLine>
          <city>Silver Spring</city>
          <state>MD</state>
          <postalCode>20901</postalCode>
          <country>US</country>
        </addr>
        <telecom value="tel:+1(301)666-6666" use="WP"/>
        <assignedPerson>
          <name>
            <given>Heartly</given>
            <family>Sixer</family>
            <suffix>MD</suffix>
          </name>
        </assignedPerson>
      </assignedAuthor>
    </author>
    <entryRelationship typeCode="SUBJ">
      <observation classCode="OBS" moodCode="EVN">
        <templateId root="2.16.840.1.113883.10.20.22.4.4"/>
        <templateId root="2.16.840.1.113883.10.20.22.4.4" extension="2015-08-01"/>
        <id extension="10241I04348" root="1.3.6.1.4.1.22812.4.111.0.4.1.2.1"/>
        <code code="55607006" displayName="Problem"
              codeSystem="2.16.840.1.113883.6.96" codeSystemName="SNOMED CT">
          <originalText>
            <reference value="#PC1problem1Type"/>
          </originalText>
          <translation code="75326-9" codeSystem="2.16.840.1.113883.6.1"
                      codeSystemName="LOINC" displayName="Problem"/>
        </code>
        <text>
          <reference value="#PC1problem1"/>
        </text>
        <statusCode code="completed"/>
        <effectiveTime>
          <!-- This represents the date of biological onset. -->
          <low value="20140227"/>
        </effectiveTime>
        <!-- This is a SNOMED code as the primary vocabulary for problem lists-->
        <value xsi:type="CD" code="395390006" codeSystem="2.16.840.1.113883.6.96"
              codeSystemName="SNOMED CT" displayName="Community Acquired Pneumonia">
          <originalText>
            <reference value="#PC1problem1Value"/>
          </originalText>
        </value>
        <author>
          <templateId root="2.16.840.1.113883.10.20.22.4.119"/>
          <time value="20140302124536"/>
          <assignedAuthor>
            <id extension="66666" root="2.16.840.1.113883.4.6"/>
            <code code="207RC0000X" codeSystem="2.16.840.1.113883.6.101"
                  codeSystemName="NUCC" displayName="Cardiovascular Disease"/>
            <addr>
              <streetAddressLine>6666 StreetName St.</streetAddressLine>
              <city>Silver Spring</city>
              <state>MD</state>
              <postalCode>20901</postalCode>
              <country>US</country>
            </addr>
            <telecom value="tel:+1(301)666-6666" use="WP"/>
            <assignedPerson>
              <name>
                <given>Heartly</given>
                <family>Sixer</family>
                <suffix>MD</suffix>
              </name>
            </assignedPerson>
          </assignedAuthor>
        </author>
      </observation>
    </entryRelationship>
  </act>
</entry>
{% endhighlight %}

**Example with simple “single act” entry structure:**

{% highlight xml %}
<section>
  <templateId root="2.16.840.1.113883.10.20.22.2.7.1"/>
  <templateId root="2.16.840.1.113883.10.20.22.2.7.1" extension="2014-06-09"/>
  <code code="47519-4" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" displayName="HISTORY OF PROCEDURES"/>
  <title>Procedures</title>
  <text>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Date and Time (Range)</th>
        </tr>
      </thead>
      <tbody>
        <tr ID="Procedure1">
          <td ID="Procedure1Desc">Individual Counseling For Medical Nutrition</td>
          <td>29 Mar 2014 10:45am</td>
        </tr>
      </tbody>
    </table>
  </text>
</section>

{% endhighlight %}


### Guidance for a consuming systems - Incorporating referenced data into a chart.
When importing, take care that you incorporate spacing that might not be represented by the ‘value’ or the xml element, but is visually obvious in raw form.

Example from ‘PC1’ the xml element/value might look like

‘Community AcquiredPneumoniaProblem                            Onset: February 27,2014Heartly Sixer, MD [March 2, 2014]Active Concern                             Monitored since: March 2, 2014                              Monitored by:Heartly Sixer, MD [march 22, 2014]’.


You may also expect extra tab and space characters if the document was ‘pretty printed’.
