// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Lexical rich-text JSON → @react-pdf/renderer elements. PDF twin of
 * `src/components/RichTextRenderer.tsx` — handles the same node set the editor
 * enables (paragraphs, headings, lists, links, text marks); unknown node types
 * render nothing. Text marks use the same Lexical format bitmask.
 */
import React from 'react'
import { Text, View, Link, StyleSheet } from '@react-pdf/renderer'

const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
} as const

type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  listType?: string
  url?: string
  fields?: { url?: string; linkType?: string; doc?: { relationTo?: string; value?: { slug?: string | null } | string | null } | null }
}

type RichTextContent = { root?: { children?: LexicalNode[] } }

const styles = StyleSheet.create({
  paragraph: { marginBottom: 6, lineHeight: 1.5 },
  h1: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 6, marginTop: 8 },
  h2: { fontSize: 12.5, fontFamily: 'Helvetica-Bold', marginBottom: 5, marginTop: 7 },
  h3: { fontSize: 11.5, fontFamily: 'Helvetica-Bold', marginBottom: 4, marginTop: 6 },
  h4: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 4, marginTop: 5 },
  list: { marginBottom: 6 },
  listItem: { flexDirection: 'row', marginBottom: 2 },
  listMarker: { width: 14 },
  listContent: { flex: 1, lineHeight: 1.5 },
})

function getLinkHref(node: LexicalNode): string | undefined {
  const f = node.fields
  if (f?.linkType === 'internal') {
    const value = f.doc?.value
    if (f.doc?.relationTo === 'methods' && value && typeof value === 'object' && value.slug) {
      return `/methods/${value.slug}`
    }
    return undefined
  }
  return f?.url ?? node.url
}

function renderText(node: LexicalNode, key: number): React.ReactNode {
  const fmt = node.format ?? 0
  const bold = !!(fmt & TEXT_FORMAT.BOLD)
  const italic = !!(fmt & TEXT_FORMAT.ITALIC)
  const family = bold && italic ? 'Helvetica-BoldOblique' : bold ? 'Helvetica-Bold' : italic ? 'Helvetica-Oblique' : undefined
  return (
    <Text
      key={key}
      style={{
        ...(family ? { fontFamily: family } : {}),
        ...(fmt & TEXT_FORMAT.UNDERLINE ? { textDecoration: 'underline' as const } : {}),
        ...(fmt & TEXT_FORMAT.STRIKETHROUGH ? { textDecoration: 'line-through' as const } : {}),
        ...(fmt & TEXT_FORMAT.CODE ? { fontFamily: 'Courier' } : {}),
      }}
    >
      {node.text ?? ''}
    </Text>
  )
}

function renderInline(nodes: LexicalNode[] | undefined): React.ReactNode[] {
  return (nodes ?? []).map((n, i) => {
    switch (n.type) {
      case 'text':
        return renderText(n, i)
      case 'linebreak':
        return <Text key={i}>{'\n'}</Text>
      case 'link':
      case 'autolink': {
        const href = getLinkHref(n)
        const children = renderInline(n.children)
        if (!href) return <Text key={i}>{children}</Text>
        return (
          <Link key={i} src={href} style={{ textDecoration: 'underline' }}>
            {children}
          </Link>
        )
      }
      default:
        return n.children ? <Text key={i}>{renderInline(n.children)}</Text> : null
    }
  })
}

function renderBlock(node: LexicalNode, key: number, color: string): React.ReactNode {
  switch (node.type) {
    case 'paragraph': {
      const inline = renderInline(node.children)
      if (inline.every(x => x == null)) return null
      return (
        <Text key={key} style={[styles.paragraph, { color }]}>
          {inline}
        </Text>
      )
    }
    case 'heading': {
      const tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
      const style = styles[tag] ?? styles.h4
      return (
        <Text key={key} style={[style, { color }]}>
          {renderInline(node.children)}
        </Text>
      )
    }
    case 'list': {
      const ordered = node.listType !== 'bullet'
      return (
        <View key={key} style={styles.list}>
          {(node.children ?? []).map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={[styles.listMarker, { color }]}>{ordered ? `${i + 1}.` : '•'}</Text>
              <Text style={[styles.listContent, { color }]}>{renderInline(item.children)}</Text>
            </View>
          ))}
        </View>
      )
    }
    case 'horizontalrule':
      return <View key={key} style={{ borderBottomWidth: 0.5, borderBottomColor: '#999', marginVertical: 6 }} />
    default:
      return null
  }
}

export function PdfRichText({ content, color = '#333' }: { content: unknown; color?: string }) {
  if (!content || typeof content !== 'object') return null
  const rich = content as RichTextContent
  if (!rich.root?.children) return null
  return <>{rich.root.children.map((node, i) => renderBlock(node, i, color))}</>
}
