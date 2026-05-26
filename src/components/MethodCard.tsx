import type { FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/navigation'
import SaveButton from './SaveButton'

type Props = {
  method: Methode
}

export default function MethodCard({ method }: Props) {
  const t = useTranslations('methods')
  const locale = useLocale()
  const characteristics = Array.isArray(method.characteristics)
    ? method.characteristics.map((c) => (typeof c === 'object' ? c : null)).filter(Boolean) as FilterItem[]
    : []

  return (
    <div className="relative group bg-white rounded-xl border border-[#d8d9ff] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <SaveButton
        item={{
          id: String(method.id),
          slug: method.slug ?? '',
          title: method.title,
          characteristics: characteristics.map((c) => getLocalizedName(c, locale)),
        }}
      />
      <div className="flex items-start">
        <Link
          href={`/methods/${method.slug}`}
          className="text-base font-semibold text-gray-900 hover:text-[#a0a2e8] transition-colors leading-snug pr-8"
        >
          {method.title}
        </Link>
      </div>

      {characteristics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {characteristics.map((c) => (
            <span key={c.id} className="text-xs px-2 py-0.5 rounded-full bg-[#d8d9ff] text-gray-700">
              {getLocalizedName(c, locale)}
            </span>
          ))}
        </div>
      )}

      <Link href={`/methods/${method.slug}`} className="text-xs text-[#a0a2e8] hover:underline mt-auto">
        {t('learnMore')}
      </Link>
    </div>
  )
}
