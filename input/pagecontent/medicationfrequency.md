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

<tr><td>REPLACE_WITH_FREQ</td><td>REPLACE_WITH_DESCRIPTION</td>
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


<tr><td>BID</td><td>Two times daily</td>
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

<tr><td>Q12H</td><td>Every 12 hours</td>
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

<tr><td>TID</td><td>Three times daily</td>
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

<tr><td>Q8H</td><td>Every 8 hours</td>
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

<tr><td>QID</td><td>Four times daily</td>
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

<tr><td>Q6H</td><td>Every 6 hours</td>
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

<tr><td>QD</td><td>Daily</td>
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

<tr><td>Q24H</td><td>Every 24 hours</td>
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

<tr><td>QOD</td><td>Every other day</td>
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

<tr><td>QM</td><td>Once a month</td>
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

<tr><td colspan="2">Every other week</td>
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

<tr><td colspan="2">Every 4-6 hours (range)</td>
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

#### 1 hour after meal
```xml
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="PC"/>
  <offset>
    <low value="1" unit="h"/>
  </offset>
</effectiveTime>
```

#### Before dinner

```xml
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="ACV"/>
</effectiveTime>
```

#### Before lunch (ante cibus diurnus)

```xml
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="ACD"/>
</effectiveTime>
```

#### At the hour of sleep

```xml
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="HS"/>
</effectiveTime>
```

#### Every evening (between dinner and sleep)

```xml
<effectiveTime xsi:type="EIVL_TS" operator="A">
  <event code="ICV"/>
</effectiveTime>
```

### TimingEvent Value Set

The `<event code="..."/>` attribute used in `EIVL_TS` relies on the HL7 **TimingEvent** code system:

- **Canonical URL:** [`http://terminology.hl7.org/CodeSystem/v3-TimingEvent`](http://terminology.hl7.org/CodeSystem/v3-TimingEvent)

Use one of the valid event codes from this value set (e.g., `ACD`, `HS`, `PC`) when expressing timing relative to meals, sleep, or other daily activities.

---

### Implementation Note

All examples on this page are **approved for use in C‑CDA**, and reflect best practices from the HL7 Pharmacy and Structured Documents Work Groups.
