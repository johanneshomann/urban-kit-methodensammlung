import React from 'react'

type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  listType?: string
  url?: string
  newTab?: boolean
}

type RichTextContent = {
  root?: {
    children?: LexicalNode[]
  }
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      )
    case 'heading': {
      const Tag = (node.tag ?? 'h2') as keyof React.JSX.IntrinsicElements
      const classes: Record<string, string> = {
        h1: 'text-2xl font-bold mb-4 mt-6',
        h2: 'text-xl font-semibold mb-3 mt-5',
        h3: 'text-lg font-semibold mb-2 mt-4',
        h4: 'text-base font-semibold mb-2 mt-3',
      }
      return (
        <Tag key={index} className={classes[node.tag ?? 'h2'] ?? 'font-semibold mb-2'}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }
    case 'list':
      return node.listType === 'bullet' ? (
        <ul key={index} className="list-disc pl-5 mb-3 space-y-1">
          {node.children?.map((child, i) => renderNode(child, i))}
        </ul>
      ) : (
        <ol key={index} className="list-decimal pl-5 mb-3 space-y-1">
          {node.children?.map((child, i) => renderNode(child, i))}
        </ol>
      )
    case 'listitem':
      return (
        <li key={index}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </li>
      )
    case 'link':
      return (
        <a
          key={index}
          href={node.url}
          target={node.newTab ? '_blank' : undefined}
          rel={node.newTab ? 'noopener noreferrer' : undefined}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      )
    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      const fmt = node.format ?? 0
      if (fmt & 1) content = <strong>{content}</strong>
      if (fmt & 2) content = <em>{content}</em>
      if (fmt & 8) content = <u>{content}</u>
      if (fmt & 4) content = <s>{content}</s>
      if (fmt & 16) content = <code className="bg-gray-100 px-1 rounded text-sm font-mono">{content}</code>
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
}

export default function RichTextRenderer({ content, className }: Props) {
  if (!content || typeof content !== 'object') return null
  const rich = content as RichTextContent
  if (!rich.root?.children) return null

  return (
    <div className={className}>
      {rich.root.children.map((node, i) => renderNode(node, i))}
    </div>
  )
}
