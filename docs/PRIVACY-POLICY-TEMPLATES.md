# Privacy Policy Templates (DE / EN)

Ready-to-paste texts for the **Datenschutzerklärung** in the Legal global
(Admin → *Rechtliches* / *Legal* → field *Datenschutzerklärung* / *Privacy
policy*, one paste per locale via the admin language switcher).

**Fresh installs don't need to paste anything:** `npm run seed` (or
`npm run seed:legal`) seeds this exact text — see `datenschutzDe` /
`datenschutzEn` in [`../src/lib/legalDefaults.ts`](../src/lib/legalDefaults.ts) —
when the field is still empty and no old platform-settings text was migrated.
To push an updated template into an existing install, run
`npm run seed:legal -- --force` (overwrites the stored text, placeholders must
be filled again). These templates are the copy-paste path and the reference if
the two ever drift.

⚠️ **The seeded/pasted text is a fill-in-the-blanks starting point, not a valid
policy.** A privacy policy is operator-specific from the first sentence
(controller identity, hosting, AI provider) — fill ALL bracketed placeholders
before go-live:

| Placeholder | What to enter |
|---|---|
| `[Betreiber:in / operator …]` | Controller: legal name, postal address, email. |
| `[Datenschutzbeauftragte:r …]` | Only if you are required to appoint one — otherwise delete the section. |
| `[Hosting-Anbieter …]` | Hosting company, city/country; confirm an AVV/DPA exists. |
| `[Log-Speicherdauer …]` | How long server logs are kept (ask your hoster; often 7–30 days). |
| `[CDN/Proxy …]` | Only if traffic runs through a CDN/proxy (e.g. Cloudflare). Delete the section if not. Non-EU providers need the standard-contractual-clauses sentence. |
| `[KI-Anbieter …]` | The provider configured in Admin → Assistant: Anthropic, OpenAI or Mistral — with legal entity + processing location. Update this whenever you switch providers. Delete the whole section if the assistant is disabled. |
| `[SMTP-Anbieter …]` | The email provider from the SMTP env vars (used only for admin password-reset mails). |
| `[Aufsichtsbehörde …]` | The competent supervisory authority for the operator (e.g. for NRW: Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen). |
| `[Datum / date]` | Date of the last update of this policy. |

Notes:

- The stock site itself stores no visitor accounts and runs **no analytics or
  tracking** — the text says so; if you ever add any, this policy (and the
  cookie policy) must be extended first.
- The "Cookies & lokale Speicherung" section only references the cookie
  policy page — keep [`COOKIE-POLICY-TEMPLATES.md`](COOKIE-POLICY-TEMPLATES.md)
  in sync instead of duplicating it here. Add the link to `/cookies` via the
  editor's link button after pasting (plain paste drops links).
- IP-based rate limiting (assistant + PDF export) is transient and in-memory —
  the text reflects that; if you move rate limiting to a persistent store,
  update the wording.

---

## Deutsch

> **Datenschutzerklärung**
>
> Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Website erhebt so
> wenige personenbezogene Daten wie möglich: Es gibt keine Nutzerkonten für
> Besucher:innen, keine Analyse- oder Tracking-Dienste und keine Weitergabe von
> Daten zu Werbezwecken.
>
> **1. Verantwortliche Stelle**
>
> [Betreiber:in ergänzen: Name/Institution, Anschrift, E-Mail-Adresse]
>
> [Falls vorhanden: Datenschutzbeauftragte:r mit Kontaktdaten ergänzen —
> andernfalls diesen Absatz löschen]
>
> **2. Hosting und Server-Logfiles**
>
> Diese Website wird gehostet bei [Hosting-Anbieter, Ort/Land ergänzen]. Beim
> Aufruf der Website verarbeitet der Server automatisch technisch notwendige
> Daten: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp
> (User-Agent) und Referrer. Diese Logfiles dienen der Sicherstellung des
> Betriebs und der Abwehr von Angriffen (Rechtsgrundlage: Art. 6 Abs. 1 lit. f
> DSGVO) und werden nach [Log-Speicherdauer ergänzen] gelöscht. Mit dem
> Hosting-Anbieter besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO).
>
> [Nur falls ein CDN/Proxy eingesetzt wird, sonst löschen:] Die Auslieferung
> der Website erfolgt über [CDN/Proxy-Anbieter ergänzen, z. B. Cloudflare Inc.,
> USA]. Dabei werden Verbindungsdaten (u. a. IP-Adresse) durch den Anbieter
> verarbeitet. Soweit der Anbieter außerhalb der EU sitzt, erfolgt die
> Übermittlung auf Grundlage von Standardvertragsklauseln (Art. 46 DSGVO).
>
> **3. Cookies und lokale Speicherung**
>
> Diese Website verwendet ausschließlich technisch notwendige bzw. funktionale
> Cookies und lokale Browser-Speicherung (z. B. für gemerkte Methoden und
> Barrierefreiheit-Einstellungen). Details enthält die
> [Cookie-Richtlinie](/cookies).
>
> **4. Methoden-Assistent (KI-Chat)**
>
> Für den optionalen Methoden-Assistenten werden Ihre Chat-Eingaben zur
> Beantwortung an einen externen KI-Anbieter übermittelt:
> [KI-Anbieter ergänzen — Standard dieser Plattform: „Mistral AI SAS, Frankreich
> (Verarbeitung in der EU)“; Alternativen: „Anthropic PBC, USA“ / „OpenAI, L.L.C., USA“]. Übermittelt werden ausschließlich die Inhalte des
> Chatverlaufs; geben Sie daher bitte keine personenbezogenen Daten in den Chat
> ein. Die Nutzung des Assistenten ist freiwillig; Rechtsgrundlage ist Ihre
> Einwilligung durch die aktive Nutzung (Art. 6 Abs. 1 lit. a DSGVO). Zur
> Missbrauchsvermeidung wird Ihre IP-Adresse kurzzeitig und ausschließlich im
> Arbeitsspeicher für eine Ratenbegrenzung verarbeitet; sie wird nicht
> dauerhaft gespeichert. [Nur bei Nicht-EU-Anbietern (Anthropic, OpenAI) ergänzen: Die
> Übermittlung in ein Drittland erfolgt auf Grundlage von
> Standardvertragsklauseln (Art. 46 DSGVO). — Beim EU-Standardanbieter
> Mistral entfällt dieser Satz ersatzlos: die Verarbeitung findet in der EU
> statt, es gibt keine Drittlandübermittlung.]
>
> **5. Merkliste und PDF-Export**
>
> Ihre gemerkten Methoden werden ausschließlich lokal in Ihrem Browser
> gespeichert. Beim Aufruf der Merklisten-Seite oder beim PDF-Export werden nur
> die Kennungen der gemerkten Methoden an den Server übertragen, um die Inhalte
> zu laden bzw. das PDF zu erzeugen; sie werden serverseitig nicht gespeichert.
> Beim PDF-Export wird Ihre IP-Adresse kurzzeitig im Arbeitsspeicher für eine
> Ratenbegrenzung verarbeitet.
>
> **6. Kontakt per E-Mail**
>
> Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen
> mitgeteilten Daten (E-Mail-Adresse, Inhalt der Nachricht) zur Bearbeitung
> Ihres Anliegens (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden
> gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und
> keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
>
> **7. Verwaltungsbereich (nur Redakteur:innen)**
>
> Für die Pflege der Inhalte existieren persönliche Konten für Redakteur:innen
> (Name, E-Mail-Adresse, Passwort-Hash). Ein technisch notwendiges
> Sitzungs-Cookie wird nur bei der Anmeldung im Verwaltungsbereich gesetzt.
> E-Mails (z. B. zum Zurücksetzen des Passworts) werden über
> [SMTP-Anbieter ergänzen] versendet.
>
> **8. Ihre Rechte**
>
> Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
> Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
> Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen Verarbeitungen auf
> Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21). Eine erteilte
> Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
> Zudem haben Sie ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde,
> z. B. bei der für uns zuständigen Behörde: [Aufsichtsbehörde mit Kontaktdaten
> ergänzen].
>
> Stand: [Datum ergänzen]

---

## English

> **Privacy Policy**
>
> Protecting your personal data matters to us. This website collects as little
> personal data as possible: there are no visitor accounts, no analytics or
> tracking services, and no sharing of data for advertising purposes.
>
> **1. Controller**
>
> [Add operator: name/institution, postal address, email address]
>
> [If applicable: add data protection officer with contact details — otherwise
> delete this paragraph]
>
> **2. Hosting and server log files**
>
> This website is hosted by [add hosting provider, city/country]. When you
> visit the website, the server automatically processes technically necessary
> data: IP address, date and time, requested page, browser type (user agent)
> and referrer. These log files serve to keep the site operational and to
> defend against attacks (legal basis: Art. 6 (1) (f) GDPR) and are deleted
> after [add log retention period]. A data processing agreement (Art. 28 GDPR)
> is in place with the hosting provider.
>
> [Only if a CDN/proxy is used, otherwise delete:] The website is delivered
> via [add CDN/proxy provider, e.g. Cloudflare Inc., USA]. Connection data
> (including the IP address) is processed by this provider. Where the provider
> is located outside the EU, the transfer is based on standard contractual
> clauses (Art. 46 GDPR).
>
> **3. Cookies and local storage**
>
> This website uses only technically necessary or functional cookies and local
> browser storage (e.g. for bookmarked methods and accessibility settings).
> Details are provided in the [cookie policy](/cookies).
>
> **4. Method Assistant (AI chat)**
>
> For the optional Method Assistant, your chat input is transmitted to an
> external AI provider to generate answers: [add AI provider — this platform's default:
> “Mistral AI SAS, France (processing within the EU)”; alternatives:
> “Anthropic PBC, USA” / “OpenAI, L.L.C., USA”]. Only the content
> of the chat conversation is transmitted; please do not enter any personal
> data into the chat. Use of the assistant is voluntary; the legal basis is
> your consent through active use (Art. 6 (1) (a) GDPR). To prevent abuse,
> your IP address is processed briefly and exclusively in memory for rate
> limiting; it is not stored permanently. [Only for non-EU providers (Anthropic, OpenAI) add: the
> third-country transfer is based on standard contractual clauses
> (Art. 46 GDPR). — With the EU default provider Mistral, delete this
> sentence entirely: processing happens within the EU, there is no
> third-country transfer.]
>
> **5. Bookmarks and PDF export**
>
> Your bookmarked methods are stored only locally in your browser. When you
> open the bookmarks page or export a PDF, only the IDs of the bookmarked
> methods are transmitted to the server to load the content or generate the
> PDF; they are not stored server-side. During PDF export, your IP address is
> processed briefly in memory for rate limiting.
>
> **6. Contact by email**
>
> If you contact us by email, we process the data you provide (email address,
> content of the message) to handle your enquiry (Art. 6 (1) (b) or (f) GDPR).
> The data is deleted once it is no longer required for processing and no
> statutory retention obligations apply.
>
> **7. Administration area (editors only)**
>
> Personal accounts exist for editors who maintain the content (name, email
> address, password hash). A technically necessary session cookie is set only
> when signing in to the administration area. Emails (e.g. password resets)
> are sent via [add SMTP provider].
>
> **8. Your rights**
>
> You have the right of access (Art. 15 GDPR), rectification (Art. 16),
> erasure (Art. 17), restriction of processing (Art. 18), data portability
> (Art. 20) and objection to processing based on Art. 6 (1) (f) GDPR
> (Art. 21). You may withdraw any consent at any time with effect for the
> future. You also have the right to lodge a complaint with a data protection
> supervisory authority, e.g. the authority responsible for us:
> [add supervisory authority with contact details].
>
> Last updated: [add date]
