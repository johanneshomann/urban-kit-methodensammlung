# Accessibility Statement Templates (DE / EN)

Ready-to-paste texts for the **Erklärung zur Barrierefreiheit** in the Legal
global (Admin → *Rechtliches* / *Legal* → field *Erklärung zur Barrierefreiheit*
/ *Accessibility statement*, one paste per locale via the admin language
switcher). Structure follows the EU model accessibility statement / BITV 2.0.

**Fresh installs don't need to paste anything:** `npm run seed` seeds this exact
statement (see `barrierefreiheitDe` / `barrierefreiheitEn` in
[`../seed.ts`](../seed.ts)) when the field is still empty. These templates are
for updating existing installs — and the reference if the two ever drift.

**Before publishing, fill the bracketed placeholders — the statement is not
valid until they are:**

| Placeholder | What to enter |
|---|---|
| `[Datum der Selbstbewertung …]` / `[… date of self-evaluation]` | When you last checked the site against WCAG 2.1 AA / BITV 2.0. A statement without an actual evaluation behind it is a legal risk — do the check. |
| `[Datum ergänzen]` / `[add date]` (×2) | When the statement was created and last reviewed. Review at least yearly and after larger changes. |
| `[E-Mail-Adresse ergänzen]` / `[add email address]` | The feedback address for reporting barriers. |
| `[Zuständige Stelle …]` / `[add responsible body …]` | The enforcement/ombudsman body for your operator. For public bodies in NRW: Ombudsstelle für barrierefreie Informationstechnik des Landes Nordrhein-Westfalen. Private operators may remove this section if no enforcement body applies. |

Notes:

- The "contact page" sentence contains a **link to `/kontakt`** — pasting plain
  text won't carry it, so select the words and add the link via the editor's
  link button.
- The "accessibility features" section describes stock functionality
  (accessibility settings popup, keyboard operability, skip link). If you
  remove or change those features, update the statement.
- If you know of non-accessible content, list it honestly under
  "Nicht barrierefreie Inhalte" instead of the "none known" sentence.

---

## Deutsch

> **Erklärung zur Barrierefreiheit**
>
> Diese Erklärung zur Barrierefreiheit gilt für die Website „Urban Kit
> Methodensammlung“. Wir sind bemüht, diese Website im Einklang mit der
> Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) barrierefrei
> zugänglich zu machen.
>
> **Stand der Vereinbarkeit mit den Anforderungen**
>
> Diese Website ist mit der BITV 2.0 (WCAG 2.1, Konformitätsstufe AA)
> vereinbar. Grundlage dieser Einschätzung ist eine am
> [Datum der Selbstbewertung ergänzen] durchgeführte Selbstbewertung.
>
> **Nicht barrierefreie Inhalte**
>
> Derzeit sind uns keine nicht barrierefreien Inhalte bekannt. Sollten Sie
> dennoch auf eine Barriere stoßen, freuen wir uns über Ihre Rückmeldung.
>
> **Barrierefreiheitsfunktionen dieser Website**
>
> Über das Barrierefreiheit-Symbol lassen sich Schriftgröße, hoher Kontrast,
> unterstrichene Links und reduzierte Animationen einstellen; die Einstellungen
> bleiben lokal im Browser gespeichert. Die Website ist vollständig per
> Tastatur bedienbar und bietet einen „Zum Inhalt springen“-Link.
>
> **Erstellung dieser Erklärung**
>
> Diese Erklärung wurde am [Datum ergänzen] erstellt und zuletzt am
> [Datum ergänzen] überprüft.
>
> **Barrieren melden: Feedback und Kontakt**
>
> Sie möchten uns bestehende Barrieren mitteilen oder Informationen zur
> Umsetzung der Barrierefreiheit erfragen? Nutzen Sie gerne unsere
> [Kontaktseite](/kontakt) oder schreiben Sie an [E-Mail-Adresse ergänzen].
> Wir bemühen uns, Anfragen innerhalb von zwei Wochen zu beantworten.
>
> **Durchsetzungsverfahren**
>
> Wenn Sie der Ansicht sind, dass unsere Antwort auf Ihre Rückmeldung nicht
> zufriedenstellend ist, können Sie sich an die zuständige Durchsetzungs- bzw.
> Ombudsstelle wenden: [Zuständige Stelle mit Kontaktdaten ergänzen — für
> öffentliche Stellen des Landes NRW ist dies die Ombudsstelle für
> barrierefreie Informationstechnik des Landes Nordrhein-Westfalen].

---

## English

> **Accessibility Statement**
>
> This accessibility statement applies to the “Urban Kit Methodensammlung”
> website. We strive to make this website accessible in accordance with the
> German Barrier-Free Information Technology Ordinance (BITV 2.0).
>
> **Compliance status**
>
> This website is compliant with BITV 2.0 (WCAG 2.1, conformance level AA).
> This assessment is based on a self-evaluation carried out on
> [add date of self-evaluation].
>
> **Non-accessible content**
>
> We are currently not aware of any non-accessible content. Should you
> nevertheless encounter a barrier, we appreciate your feedback.
>
> **Accessibility features of this website**
>
> Via the accessibility icon you can adjust font size, high contrast,
> underlined links and reduced animations; the settings are kept locally in
> your browser. The website is fully keyboard-operable and offers a
> “skip to content” link.
>
> **Preparation of this statement**
>
> This statement was prepared on [add date] and last reviewed on [add date].
>
> **Reporting barriers: feedback and contact**
>
> Would you like to report existing barriers or request information on the
> implementation of accessibility? Please use our [contact page](/kontakt) or
> write to [add email address]. We aim to respond to enquiries within two
> weeks.
>
> **Enforcement procedure**
>
> If you believe that our response to your feedback is not satisfactory, you
> can contact the responsible enforcement/ombudsman body: [add responsible body
> with contact details — for public bodies of the state of North
> Rhine-Westphalia this is the Ombudsstelle für barrierefreie
> Informationstechnik des Landes Nordrhein-Westfalen].
