'use client'

import SavedExport from '@/components/SavedExport'
import { useSaved } from '@/hooks/useSaved'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

export default function SavedPage() {
  const { saved, remove, mounted } = useSaved()
  const t = useTranslations('saved')

  if (!mounted) {
    return <div className="py-16 text-center text-gray-400"><LoadingText /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{t('title')}</h1>
          <p className="text-gray-500">
            {saved.length === 1 ? t('countOne') : t('countMany', { count: saved.length })}
          </p>
        </div>
        <SavedExport items={saved} />
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">{t('empty')}</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            {t('discover')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/methods/${item.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {item.title}
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                  title={t('remove')}
                >
                  ✕
                </button>
              </div>

              {item.characteristics && item.characteristics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.characteristics.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/methods/${item.slug}`}
                className="text-xs text-blue-600 hover:underline mt-auto"
              >
                {t('viewDetails')}
              </Link>
            </div>
          ))}
        </div>
      )}

      {saved.length > 1 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('comparison')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-medium text-gray-600">{t('method')}</th>
                  <th className="text-left p-3 border border-gray-200 font-medium text-gray-600">{t('characteristics')}</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-200">
                      <Link href={`/methods/${item.slug}`} className="text-blue-600 hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="p-3 border border-gray-200">
                      {item.characteristics?.join(', ') ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function LoadingText() {
  const t = useTranslations()
  return <>{t('loading')}</>
}
