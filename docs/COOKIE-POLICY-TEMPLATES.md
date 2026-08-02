# Cookie Policy Templates (DE / EN)

Ready-to-paste texts for the **cookie policy** in the Legal global
(Admin → *Rechtliches* / *Legal* → field *Cookie-Richtlinie* / *Cookie policy*,
one paste per locale via the admin language switcher).

**Fresh installs don't need to paste anything:** `npm run seed` seeds this exact
policy (see `cookiePolicyDe` / `cookiePolicyEn` in [`../seed.ts`](../seed.ts))
when the field is still empty. These templates are for updating existing
installs — and the reference if the two ever drift.

They describe exactly what the **stock codebase** stores — nothing more:

| Storage | Key | Set by |
|---|---|---|
| Cookie (session) | `NEXT_LOCALE` | next-intl, only when the visitor switches the language |
| Cookie (~2 h, httpOnly) | `payload-token` | Payload admin login — editors only, never for visitors |
| localStorage | `uk-saved` | Bookmarked methods (`src/lib/saved.ts`) |
| localStorage | `uk-a11y` | Accessibility settings (`src/lib/accessibility.ts`) |
| sessionStorage | `uk-cookie-notice-ack` | Storage-notice dismissal (`src/components/CookieNotice.tsx`) |
| sessionStorage | `uk-assistant-chat` | Current assistant chat transcript (`src/components/MethodAssistant.tsx`) |

**Keep the policy in sync with the code:** if you add analytics, embeds, or any
other storage, these texts are no longer accurate and must be extended.
The `uk-saved` wording deliberately mentions that the stored method IDs are sent
to the server when loading the saved page or generating a PDF — do not simplify
it to "never transmitted".

---

## Deutsch

> **Cookies & lokale Speicherung**
>
> Diese Website verwendet ausschließlich technisch notwendige bzw. funktionale
> Cookies und lokale Browser-Speicherung. Es findet kein Tracking statt, es
> werden keine Analyse- oder Marketing-Cookies gesetzt und keine Daten an
> Dritte weitergegeben. Eine Einwilligung (Cookie-Banner) ist daher nicht
> erforderlich. Rechtsgrundlage ist § 25 Abs. 2 TDDDG i. V. m.
> Art. 6 Abs. 1 lit. f DSGVO.
>
> **Cookies**
>
> - **NEXT_LOCALE** – Speichert die gewählte Sprache (Deutsch/Englisch). Wird
>   nur gesetzt, wenn Sie die Sprache aktiv wechseln. Funktional, First-Party,
>   Sitzungs-Cookie (wird beim Schließen des Browsers gelöscht).
> - **payload-token** – Anmelde-Sitzung für den Verwaltungsbereich (/admin).
>   Wird ausschließlich für angemeldete Redakteur:innen gesetzt, nicht für
>   Besucher:innen der Website. Technisch notwendig, httpOnly, Laufzeit
>   ca. 2 Stunden.
>
> **Lokale Speicherung (Local Storage / Session Storage)**
>
> Die folgenden Daten liegen ausschließlich lokal in Ihrem Browser und werden
> nicht auf dem Server gespeichert:
>
> - **uk-saved** – Ihre gemerkten Methoden. Funktional, bleibt bis zum Löschen
>   erhalten. Hinweis: Die gespeicherten Methoden-Kennungen werden nur dann an
>   den Server übertragen, wenn Sie die Seite „Gemerkte Methoden“ aufrufen oder
>   ein PDF erzeugen – sie dienen dort ausschließlich zum Laden der Inhalte und
>   werden serverseitig nicht gespeichert.
> - **uk-a11y** – Ihre Barrierefreiheit-Einstellungen (Schriftgröße, reduzierte
>   Animationen, hoher Kontrast, unterstrichene Links). Funktional, bleibt bis
>   zum Löschen erhalten.
> - **uk-cookie-notice-ack** – Merkt sich, dass Sie den Speicherhinweis
>   geschlossen haben. Session Storage, wird beim Schließen des Tabs gelöscht.
> - **uk-assistant-chat** – Ihr aktueller Chat-Verlauf mit dem
>   Methoden-Assistenten, damit er beim Navigieren auf der Website erhalten
>   bleibt. Session Storage, wird beim Schließen des Tabs gelöscht.
>
> **Ihre Kontrolle**
>
> Sie können Cookies und lokale Speicherung jederzeit über die Einstellungen
> Ihres Browsers löschen oder blockieren. Das Löschen der lokalen Speicherung
> entfernt Ihre gemerkten Methoden und Ihre Barrierefreiheit-Einstellungen;
> die Funktionsfähigkeit der Website kann dadurch eingeschränkt sein.

---

## English

> **Cookies & local storage**
>
> This website uses only technically necessary or functional cookies and local
> browser storage. There is no tracking, no analytics or marketing cookies, and
> no sharing of data with third parties. Consent (a cookie banner) is therefore
> not required. The legal basis is Section 25 (2) TDDDG in conjunction with
> Art. 6 (1) (f) GDPR.
>
> **Cookies**
>
> - **NEXT_LOCALE** – Stores your chosen language (German/English). Only set
>   when you actively switch the language. Functional, first-party, session
>   cookie (deleted when the browser is closed).
> - **payload-token** – Login session for the administration area (/admin).
>   Set exclusively for signed-in editors, never for website visitors.
>   Technically necessary, httpOnly, lifetime approx. 2 hours.
>
> **Local storage (local storage / session storage)**
>
> The following data lives only locally in your browser and is not stored on
> the server:
>
> - **uk-saved** – Your bookmarked methods. Functional, kept until cleared.
>   Note: the stored method IDs are transmitted to the server only when you
>   open the “Bookmarked Methods” page or generate a PDF – they are used solely
>   to load the content and are not stored server-side.
> - **uk-a11y** – Your accessibility settings (font size, reduced motion, high
>   contrast, underlined links). Functional, kept until cleared.
> - **uk-cookie-notice-ack** – Remembers that you dismissed the storage notice.
>   Session storage, deleted when the tab is closed.
> - **uk-assistant-chat** – Your current chat transcript with the Method
>   Assistant, so it survives navigating around the website. Session storage,
>   deleted when the tab is closed.
>
> **Your control**
>
> You can delete or block cookies and local storage at any time via your
> browser settings. Clearing local storage removes your bookmarked methods and
> your accessibility settings; parts of the website may work with reduced
> functionality as a result.
