## 🧾 Introduction

This page provides best practices for representing medication frequency in CDA (C‑CDA), focusing on correct use of `effectiveTime` with both **PIVL_TS** (periodic intervals) and **EIVL_TS** (event‑based intervals). These examples also highlight the `institutionSpecified` attribute and are approved by the HL7 Pharmacy Structured Documents Work Group.

> **institutionSpecified**  
> - `true` = schedule based on episodes (e.g., TID = three times per day)  
> - `false` / not present = fixed intervals (e.g., Q8H = every 8 hours)

---

### PIVL_TS Examples (Periodic Intervals)

Use `PIVL_TS` when specifying regular periodic medication schedules.  

---

<!--
Model for XML tr:

<tr><th>REPLACE_WITH_FREQ</th><td>REPLACE_WITH_DESCRIPTION</td>
<td>
<div markdown="1">
{% highlight xml %}

{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}

{% endhighlight %}
</div>
</td>
</tr>


-->


<table class="grid">
<tr><th>Frequency</th><th>Description</th><th>Preferred (units align with description)</th><th>Known other representation</th></tr>


<tr><th>BID</th><td>Two times daily</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="0.5" unit="d"/>
</effectiveTime>
{% endhighlight %}

</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="12" unit="h"/>
</effectiveTime>
{% endhighlight %}

</div>
</td>
</tr>

<tr><th>Q12H</th><td>Every 12 hours</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="12" unit="h"/>
</effectiveTime>
{% endhighlight %}

</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="0.5" unit="d"/>
</effectiveTime>
{% endhighlight %}

</div>
</td>
</tr>

<tr><th>TID</th><td>Three times daily</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="0.3333" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="8" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>Q8H</th><td>Every 8 hours</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="8" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="0.3333" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>QID</th><td>Four times daily</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="0.25" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="6" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>Q6H</th><td>Every 6 hours</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="6" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="0.25" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>QD</th><td>Daily</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="1" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="24" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>Q24H</th><td>Every 24 hours</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="24" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period value="1" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>QOD</th><td>Every other day</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="2" unit="d"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="48" unit="h"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>QM</th><td>Once a month</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="1" unit="mo"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
</td>
</tr>

<tr><td></td><td>Every other week</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A"
  institutionSpecified="true">
  <period value="2" unit="wk"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
</td>
</tr>

<tr><td></td><td>Every 4-6 hours (range)</td>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="PIVL_TS" operator="A">
  <period xsi:type="IVL_PQ">
    <low value="4" unit="h"/>
    <high value="6" unit="h"/>
  </period>
</effectiveTime>
{% endhighlight %}
</div>
</td>
<td>
</td>
</tr>

</table>

### EIVL_TS Examples (Event-Based Intervals)

Use `EIVL_TS` when dosing is based on an event (e.g., mealtime):

<table class="grid">
<tr><th>1 hour after meal</th>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="PC"/>
  <offset>
    <low value="1" unit="h"/>
  </offset>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>Before dinner</th>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="ACV"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>Before lunch (ante cibus diurnus)</th>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="ACD"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>At the hour of sleep</th>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="HS"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

<tr><th>Every evening (between dinner and sleep)</th>
<td>
<div markdown="1">
{% highlight xml %}
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="ICV"/>
</effectiveTime>
{% endhighlight %}
</div>
</td>
</tr>

</table>


### TimingEvent Value Set

The `<event code="..."/>` attribute used in `EIVL_TS` relies on the HL7 **TimingEvent** code system:

- **Canonical URL:** [`http://terminology.hl7.org/CodeSystem/v3-TimingEvent`](http://terminology.hl7.org/CodeSystem/v3-TimingEvent)

Use one of the valid event codes from this value set (e.g., `ACD`, `HS`, `PC`) when expressing timing relative to meals, sleep, or other daily activities.

---

### Implementation Note

All examples on this page are **approved for use in C‑CDA**, and reflect best practices from the HL7 Pharmacy and Structured Documents Work Groups.
