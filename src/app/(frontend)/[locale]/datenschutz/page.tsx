import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'datenschutz' })
  return { title: t('title') }
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'datenschutz' })

  return (
    <div className="max-w-2xl mx-auto prose prose-sm">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('generalTitle')}</h2>
        <p className="text-gray-600">{t('generalText')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('cookiesTitle')}</h2>
        <p className="text-gray-600">{t('cookiesText')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('contactTitle')}</h2>
        <p className="text-gray-600">{t('contactText')}</p>
      </section>
    </div>
  )
}
