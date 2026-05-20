import FilterableMethodList from '@/components/FilterableMethodList'
import type { Methode } from '@/types'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations('home')

  const result = await payload.find({
    collection: 'methods',
    where: {
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  const methods = result.docs as unknown as Methode[]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-[#a0a2e8] mb-6">{t('title')}</h1>
        <div className="max-w-2xl space-y-3 text-gray-600 text-sm leading-relaxed">
          <p>Stelle bei jedem Kontakt sicher, dass sich alle auf Augenhöhe respektvoll verständigen (können).</p>
          <p>Kläre im Vorfeld, ob unterstützende Angebote wie z.B. Dolmetscher:innen notwendig sind, damit alle Teilnehmenden dem Gespräch folgen und sich einbringen können.</p>
          <p>Du kannst die Teilnehmenden bitten, ihre Namen und ihre Pronomen auf ein Namensschild/Klebeband zu schreiben und gut sichtbar an sich zu tragen. Das kann eine respektvolle, offene und zugewandte Gesprächsatmosphäre unterstützen. Du kannst also immer Tape und Stifte mitbringen.</p>
          <p>Sieh zu, dass du immer eine Dokumentationsmöglichkeit (Laptop, Tablett, Stift und Zettel) parat hast, um bei Diskussionen mitzuschreiben.</p>
          <p>Passende Räumlichkeiten: ausreichend großer Raum mit guter Akustik, Sitzmöglichkeiten</p>
        </div>
      </div>

      <FilterableMethodList methods={methods} />
    </div>
  )
}
