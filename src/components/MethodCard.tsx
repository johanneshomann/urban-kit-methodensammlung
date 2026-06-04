import type { FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { getMethodImageUrl } from '@/lib/methodImage'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import SaveButton from './SaveButton'

type Props = {
  method: Methode
  showAuszug?: boolean
}

export default function MethodCard({ method, showAuszug }: Props) {
  const locale = useLocale()
  const auszug = locale === 'de' ? method.auszug : (method.auszugEn ?? method.auszug)
  const characteristics = Array.isArray(method.characteristics)
    ? method.characteristics.map((c) => (typeof c === 'object' ? c : null)).filter(Boolean) as FilterItem[]
    : []

  const imageUrl = getMethodImageUrl(method.image, method.id)

  return (
    <div className="relative group rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-all" style={{ background: 'var(--method-white)' }}>
      {/* Image strip with save button inside */}
      <div className="relative h-56 w-full overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <SaveButton
          item={{
            id: String(method.id),
            slug: method.slug ?? '',
            title: method.title,
            characteristics: characteristics.map((c) => getLocalizedName(c, locale)),
          }}
        />
      </div>

      {/* Content */}
      <div className="pointer-events-none flex flex-col gap-4 p-8 flex-1">
        <p className="text-display font-black leading-tight transition-colors text-ink-accent group-hover:text-ink">
          {method.title}
        </p>

        {showAuszug && auszug && (
          <p className="text-small line-clamp-3" style={{ color: 'var(--method-ink)', opacity: 0.7 }}>
            {auszug}
          </p>
        )}

        {characteristics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {characteristics.map((c) => (
              <span
                key={c.id}
                className="text-small px-3 py-0.5 rounded-full"
                style={{ background: 'var(--method-light)', color: 'var(--method-ink)' }}
              >
                {getLocalizedName(c, locale)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Full-card link overlay — on top of image and content, below SaveButton */}
      <Link
        href={`/methods/${method.slug}`}
        className="absolute inset-0 z-10"
        aria-label={method.title}
      />
    </div>
  )
}
