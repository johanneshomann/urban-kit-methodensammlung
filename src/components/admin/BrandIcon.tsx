import { getPlatformIdentity } from '@/lib/platformIdentity'

/**
 * Small admin icon (collapsed nav). Reuses the favicon (square brand mark)
 * from Platform Settings → Branding, falling back to the built-in default.
 */
export async function BrandIcon() {
  const { favicon } = await getPlatformIdentity()
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={favicon} alt="" style={{ height: 28, width: 28, objectFit: 'contain' }} />
}
