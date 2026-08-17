import { ShortRedirect } from "./short-redirect"

export default async function ShortLinkPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <ShortRedirect code={code} />
}
