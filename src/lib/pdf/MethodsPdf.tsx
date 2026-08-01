// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * PDF export document: one A4 page (or more, content flows) per method — a
 * full-content handout with goal, complete procedure, notes, classifications
 * and a link back to the method page. Text-only by design (no images) and
 * built on the PDF standard Helvetica fonts, so nothing is fetched or
 * embedded. Brand colors come from the platform settings via `resolveColors`.
 */
import React from 'react'
import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer'
import { PdfRichText } from './richText'
import { FILTER_CONFIGS } from '../filterConfig'
import type { MethodensammlungColors } from '../theme'
import type { FilterItem, Methode, MethodSection } from '@/types'

const L = {
  de: {
    collection: 'Urban Kit – Methodensammlung',
    savedTitle: 'Gemerkte Methoden',
    method: 'Methode',
    goal: 'Ziel der Methode',
    procedure: 'Ablauf',
    vorbereitung: 'Vorbereitung',
    durchfuehrung: 'Durchführung',
    auswertung: 'Auswertung',
    section: 'Abschnitt',
    wann: 'Wann sinnvoll?',
    wannNicht: 'Wann nicht sinnvoll?',
    tipps: 'Tipps',
    ungeeignet: 'Ungeeignet für',
    classification: 'Zuordnung',
    online: 'Online ansehen',
    page: (n: number, total: number) => `Seite ${n} von ${total}`,
    exported: (date: string) => `Exportiert am ${date}`,
    count: (n: number) => `${n} ${n === 1 ? 'Methode' : 'Methoden'}`,
  },
  en: {
    collection: 'Urban Kit – Method Collection',
    savedTitle: 'Saved Methods',
    method: 'Method',
    goal: 'Goal of the method',
    procedure: 'Procedure',
    vorbereitung: 'Preparation',
    durchfuehrung: 'Execution',
    auswertung: 'Evaluation',
    section: 'Section',
    wann: 'When useful?',
    wannNicht: 'When not useful?',
    tipps: 'Tips',
    ungeeignet: 'Not suitable for',
    classification: 'Classification',
    online: 'View online',
    page: (n: number, total: number) => `Page ${n} of ${total}`,
    exported: (date: string) => `Exported on ${date}`,
    count: (n: number) => `${n} ${n === 1 ? 'method' : 'methods'}`,
  },
} as const

function hasRichContent(val: unknown): boolean {
  const walk = (n: unknown): boolean => {
    if (!n || typeof n !== 'object') return false
    const node = n as { text?: string; children?: unknown[] }
    if (typeof node.text === 'string' && node.text.trim() !== '') return true
    return Array.isArray(node.children) && node.children.some(walk)
  }
  const root = (val as { root?: { children?: unknown[] } } | null)?.root
  return Array.isArray(root?.children) && root.children.some(walk)
}

function sections(val: MethodSection[] | null | undefined): MethodSection[] {
  return (val ?? []).filter(s => hasRichContent(s?.content) || !!s?.sectionTitle?.trim())
}

function resolveItems(items: (FilterItem | string)[] | null | undefined): FilterItem[] {
  return (items ?? []).map(i => (typeof i === 'object' ? i : null)).filter(Boolean) as FilterItem[]
}

const styles = StyleSheet.create({
  page: { paddingTop: 46, paddingBottom: 52, paddingHorizontal: 48, fontSize: 10, fontFamily: 'Helvetica' },
  headerBar: { position: 'absolute', top: 18, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between' },
  headerText: { fontSize: 8, color: '#888' },
  footer: { position: 'absolute', bottom: 22, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  auszug: { fontSize: 10.5, lineHeight: 1.5, marginBottom: 10 },
  rule: { borderBottomWidth: 2, marginBottom: 10, marginTop: 2 },
  sectionLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, marginTop: 10 },
  phaseTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 3, marginTop: 6 },
  stepTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 2, marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 3, alignItems: 'flex-start' },
  chipLabel: { width: 110, fontSize: 8.5, fontFamily: 'Helvetica-Bold', paddingTop: 2 },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  chip: { fontSize: 8.5, borderWidth: 0.75, borderRadius: 7, paddingHorizontal: 6, paddingVertical: 1.5, marginRight: 3, marginBottom: 3 },
  link: { fontSize: 9, textDecoration: 'underline', marginTop: 10 },
})

type Props = {
  methods: Methode[]
  locale: 'de' | 'en'
  colors: MethodensammlungColors
  baseUrl: string
  date: string
}

export function MethodsPdf({ methods, locale, colors, baseUrl, date }: Props) {
  const t = L[locale]
  const ink = colors.ink
  const inkAccent = colors.inkAccent
  const accent = colors.methodAccent
  const dark = colors.methodDark
  const multi = methods.length > 1

  const phases = (m: Methode) =>
    ([
      [t.vorbereitung, sections(m.vorbereitung)],
      [t.durchfuehrung, sections(m.durchfuehrung)],
      [t.auswertung, sections(m.auswertung)],
    ] as [string, MethodSection[]][]).filter(([, s]) => s.length > 0)

  const notes = (m: Methode) =>
    ([
      [t.wann, m.wannSinnvoll],
      [t.wannNicht, m.wannNichtSinnvoll],
      [t.tipps, m.tipps],
      [t.ungeeignet, m.ungeeignetFuer],
    ] as [string, unknown][]).filter(([, v]) => hasRichContent(v))

  return (
    <Document
      title={multi ? `${t.collection} – ${t.savedTitle}` : `${t.collection} – ${methods[0]?.title ?? ''}`}
      author="Urban Kit"
      language={locale}
    >
      {methods.map((m, mi) => (
        <Page key={String(m.id)} size="A4" style={styles.page}>
          {/* Running header / footer */}
          <View style={styles.headerBar} fixed>
            <Text style={styles.headerText}>{t.collection}</Text>
            {multi && <Text style={styles.headerText}>{`${t.method} ${mi + 1} / ${methods.length}`}</Text>}
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.headerText}>{t.exported(date)}</Text>
            <Text style={styles.headerText} render={({ pageNumber, totalPages }) => t.page(pageNumber, totalPages)} />
          </View>

          {/* Title block */}
          <Text style={[styles.title, { color: inkAccent }]}>{m.title}</Text>
          <View style={[styles.rule, { borderBottomColor: dark }]} />
          {m.auszug && <Text style={[styles.auszug, { color: ink }]}>{m.auszug}</Text>}

          {/* Classifications */}
          <View>
            {FILTER_CONFIGS.map(({ key, de: labelDe, en: labelEn }) => {
              const names = resolveItems(m[key]).map(f => f.name ?? '').filter(Boolean)
              if (names.length === 0) return null
              return (
                <View key={key} style={styles.chipRow}>
                  <Text style={[styles.chipLabel, { color: inkAccent }]}>{locale === 'de' ? labelDe : labelEn}</Text>
                  <View style={styles.chips}>
                    {names.map(n => (
                      <Text key={n} style={[styles.chip, { borderColor: accent, color: ink }]}>{n}</Text>
                    ))}
                  </View>
                </View>
              )
            })}
          </View>

          {/* Goal */}
          {hasRichContent(m.zielDerMethode) && (
            <View>
              <Text style={[styles.sectionLabel, { color: dark }]}>{t.goal}</Text>
              <PdfRichText content={m.zielDerMethode} color={ink} />
            </View>
          )}

          {/* Procedure — full content */}
          {phases(m).length > 0 && (
            <View>
              <Text style={[styles.sectionLabel, { color: dark }]}>{t.procedure}</Text>
              {phases(m).map(([label, secs]) => (
                <View key={label}>
                  <Text style={[styles.phaseTitle, { color: inkAccent }]}>{label}</Text>
                  {secs.map((s, si) => (
                    <View key={s.id ?? si}>
                      {(secs.length > 1 || s.sectionTitle?.trim()) && (
                        <Text style={[styles.stepTitle, { color: inkAccent }]}>
                          {`${si + 1}. ${s.sectionTitle?.trim() || `${t.section} ${si + 1}`}`}
                        </Text>
                      )}
                      <PdfRichText content={s.content} color={ink} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Notes */}
          {notes(m).map(([label, content]) => (
            <View key={label}>
              <Text style={[styles.sectionLabel, { color: dark }]}>{label}</Text>
              <PdfRichText content={content} color={ink} />
            </View>
          ))}

          {/* Link back */}
          <Link src={`${baseUrl}/${locale}/methods/${m.slug}`} style={[styles.link, { color: dark }]}>
            {`${t.online}: ${baseUrl}/${locale}/methods/${m.slug}`}
          </Link>
        </Page>
      ))}
    </Document>
  )
}
