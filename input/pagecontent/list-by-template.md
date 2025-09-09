{% assign all_resources = site.data.ImplementationGuide-hl7cdaexamples.definition.resource | where: "isExample", true %}

{% assign resources = "" | split: "" %}
{% assign all_profiles = "" | split: "" %}
{% for resource in all_resources %}
  {% assign approvalExtension = resource.extension | where: "url", "http://hl7.org/cda/hl7.cda.examples/StructureDefinition/ExampleApprovalStatus" | first %}
  {% assign statusExtension = approvalExtension.extension | where: "url", "status" | first %}
  {% if resource.profile %}
   {% unless statusExtension.valueCode == "draft" %}
      {% assign resources = resources | push: resource %}
      {% for profile in resource.profile %}
        {% unless profile contains "hl7.org/cda/stds/core" %}
          {% assign all_profiles = all_profiles | push: profile %}
        {% endunless %}
      {% endfor %}
    {% endunless %}
  {% endif %}
{% endfor %}
{% assign unique_profiles = all_profiles | uniq | sort %}


{% assign documents = "" | split: "" %}
{% assign sections = "" | split: "" %}
{% assign entries = "" | split: "" %}
{% for profile in unique_profiles %}
  {% if profile contains "Section" %}
    {% assign sections = sections | push: profile %}
  {% elsif profile contains "NoteActivity" or profile contains "ExternalDocumentReference" %}
    {% assign entries = entries | push: profile %}
  {% elsif profile contains "Document" or profile contains "Header" or profile contains "Note" %}
    {% assign documents = documents | push: profile %}
  {% else %}
    {% assign entries = entries | push: profile %}
  {% endif %}
{% endfor %}


### Document Templates
<table class="grid">
  <tr><th>Template</th><th>Examples</th></tr>
  {% for profile in documents %}
    <tr>
      <td><a href="{{ profile }}">{{ profile | split: '/' | last }}</a></td>
      <td>
      {% assign matching_resources = resources | where_exp: "resource", "resource.profile contains profile" %}
      <ul>
        {% for resource in matching_resources %}
          <li>
            <a href="{{ resource.reference.reference | replace: '/', '-' }}.html">{{ resource.name }}</a>
          </li>
        {% endfor %}
      </ul>
      </td>
    </tr>
  {% endfor %}
</table>

### Section Templates
<table class="grid">
  <tr><th>Template</th><th>Examples</th></tr>
  {% for profile in sections %}
    <tr>
      <td><a href="{{ profile }}">{{ profile | split: '/' | last }}</a></td>
      <td>
      {% assign matching_resources = resources | where_exp: "resource", "resource.profile contains profile" %}
      <ul>
        {% for resource in matching_resources %}
          <li>
            <a href="{{ resource.reference.reference | replace: '/', '-' }}.html">{{ resource.name }}</a>
          </li>
        {% endfor %}
      </ul>
      </td>
    </tr>
  {% endfor %}
</table>

### Entry Templates
<table class="grid">
  <tr><th>Template</th><th>Examples</th></tr>
  {% for profile in entries %}
    <tr>
      <td><a href="{{ profile }}">{{ profile | split: '/' | last }}</a></td>
      <td>
      {% assign matching_resources = resources | where_exp: "resource", "resource.profile contains profile" %}
      <ul>
        {% for resource in matching_resources %}
          <li>
            <a href="{{ resource.reference.reference | replace: '/', '-' }}.html">{{ resource.name }}</a>
          </li>
        {% endfor %}
      </ul>
      </td>
    </tr>
  {% endfor %}
</table>

