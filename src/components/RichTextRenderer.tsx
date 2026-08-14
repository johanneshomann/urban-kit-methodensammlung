// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Minimal renderer for Payload's Lexical rich-text JSON. Walks the node tree and
 * maps the handful of node types we actually enable in the editor
 * (payload.config.ts) to HTML. Unknown node types render nothing.
 */
import React from 'react'

// Lexical encodes inline text styles as a bitmask on `format`. These are the bits
// for the marks we enable; combine with `&` (a run can be bold *and* italic, etc.).
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
  newTab?: boolean
  // Payload's LinkFeature serializes link data under `fields`, not on the node
  // itself. `doc` is populated (object) at sufficient query depth.
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: 'custom' | 'internal'
    doc?: { relationTo?: string; value?: { slug?: string | null } | string | null } | null
  }
}

// Resolve a link/autolink node's href: custom URL (Payload keeps it under
// `fields`; plain Lexical uses `url`) or a populated internal method link.
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

type RichTextContent = {
  root?: {
    children?: LexicalNode[]
  }
}

type RenderOpts = {
  /** Replaces the default per-tag heading classes (applied to ALL heading levels). */
  headingClassName?: string
  /** Appended to the default paragraph classes. */
  paragraphClassName?: string
}

function renderNode(node: LexicalNode, index: number, opts: RenderOpts = {}): React.ReactNode {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={index} className={`mb-3 leading-relaxed${opts.paragraphClassName ? ` ${opts.paragraphClassName}` : ''}`}>
          {node.children?.map((child, i) => renderNode(child, i, opts))}
        </p>
      )
    case 'heading': {
      const Tag = (node.tag ?? 'h2') as keyof React.JSX.IntrinsicElements
      const classes: Record<string, string> = {
        h1: 'text-2xl font-bold mb-4 mt-6',
        h2: 'text-xl font-bold mb-3 mt-5',
        h3: 'text-lg font-bold mb-2 mt-4',
        h4: 'text-base font-bold mb-2 mt-3',
      }
      return (
        <Tag key={index} className={opts.headingClassName ?? classes[node.tag ?? 'h2'] ?? 'font-bold mb-2'}>
          {node.children?.map((child, i) => renderNode(child, i, opts))}
        </Tag>
      )
    }
    case 'list':
      return node.listType === 'bullet' ? (
        <ul key={index} className="list-disc pl-5 mb-3 space-y-1">
          {node.children?.map((child, i) => renderNode(child, i, opts))}
        </ul>
      ) : (
        <ol key={index} className="list-decimal pl-5 mb-3 space-y-1">
          {node.children?.map((child, i) => renderNode(child, i, opts))}
        </ol>
      )
    case 'listitem':
      return (
        <li key={index}>
          {node.children?.map((child, i) => renderNode(child, i, opts))}
        </li>
      )
    case 'link':
    case 'autolink': {
      const href = getLinkHref(node)
      const children = node.children?.map((child, i) => renderNode(child, i))
      // No resolvable target (e.g. internal link whose doc wasn't populated or
      // was deleted) → render the text without a dead anchor.
      if (!href) return <React.Fragment key={index}>{children}</React.Fragment>
      const newTab = node.fields?.newTab ?? node.newTab
      return (
        <a
          key={index}
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="underline transition-colors"
          style={{ color: 'var(--method-dark)' }}
        >
          {children}
        </a>
      )
    }
    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      const fmt = node.format ?? 0
      if (fmt & TEXT_FORMAT.BOLD) content = <strong>{content}</strong>
      if (fmt & TEXT_FORMAT.ITALIC) content = <em>{content}</em>
      if (fmt & TEXT_FORMAT.UNDERLINE) content = <u>{content}</u>
      if (fmt & TEXT_FORMAT.STRIKETHROUGH) content = <s>{content}</s>
      if (fmt & TEXT_FORMAT.CODE) content = <code className="bg-method-very-light px-1 rounded text-small font-mono">{content}</code>
      return <React.Fragment key={index}>{content}</React.Fragment>
    }
    case 'linebreak':
      return <br key={index} />
    default:
      return null
  }
}

type Props = {
  content: unknown
  className?: string
} & RenderOpts

export default function RichTextRenderer({ content, className, headingClassName, paragraphClassName }: Props) {
  if (!content || typeof content !== 'object') return null
  const rich = content as RichTextContent
  if (!rich.root?.children) return null

  return (
    <div className={className}>
      {rich.root.children.map((node, i) => renderNode(node, i, { headingClassName, paragraphClassName }))}
    </div>
  )
}
