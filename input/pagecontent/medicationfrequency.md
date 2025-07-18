## 🧾 Introduction

This page provides best practices for representing medication frequency in CDA (C‑CDA), focusing on correct use of `effectiveTime` with both **PIVL_TS** (periodic intervals) and **EIVL_TS** (event‑based intervals). These examples also highlight the `institutionSpecified` attribute and are approved by the HL7 Pharmacy Structured Documents Work Group.

> **institutionSpecified**  
> - `true` = schedule based on episodes (e.g., TID = three times per day)  
> - `false` / not present = fixed intervals (e.g., Q8H = every 8 hours)

---

## PIVL_TS Examples (Periodic Intervals)

Use `PIVL_TS` when specifying regular periodic medication schedules:

| Frequency | Description          | Preferred XML (PIVL_TS)                                                | Alternate XML |
|----------|----------------------|------------------------------------------------------------------------|----------------|
| **BID** | Two times daily       | `<period value="0.5" unit="d" institutionSpecified="true"/>`           | `<period value="12" unit="h"/>` |
| **Q12H** | Every 12 hours       | `<period value="12" unit="h"/>`                                        | `<period value="0.5" unit="d"/>` |
| **TID** | Three times daily     | `<period value="0.3333" unit="d" institutionSpecified="true"/>`        | `<period value="8" unit="h"/>` |
| **Q8H** | Every 8 hours         | `<period value="8" unit="h"/>`                                         | `<period value="0.3333" unit="d"/>` |
| **QID** | Four times daily      | `<period value="0.25" unit="d" institutionSpecified="true"/>`          | `<period value="6" unit="h"/>` |
| **Q6H** | Every 6 hours         | `<period value="6" unit="h"/>`                                         | `<period value="0.25" unit="d"/>` |
| **QD**  | Daily                 | `<period value="1" unit="d" institutionSpecified="true"/>`             | `<period value="24" unit="h"/>` |
| **Q24H**| Every 24 hours        | `<period value="24" unit="h"/>`                                        | `<period value="1" unit="d"/>` |
| **QOD** | Every other day       | `<period value="2" unit="d" institutionSpecified="true"/>`             | `<period value="48" unit="h"/>` |
| **QM**  | Once a month          | `<period value="1" unit="mo" institutionSpecified="true"/>`            | — |
| —        | Every other week      | `<period value="2" unit="wk" institutionSpecified="true"/>`            | — |
| —        | Every 4–6 hours (range)| `<period xsi:type="IVL_PQ"><low value="4" unit="h"/><high value="6" unit="h"/></period>` | — |

---

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
