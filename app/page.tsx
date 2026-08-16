import { TardsStoreProvider } from "@/lib/store"
import { TardsApp } from "@/components/tards-app"

export default function Page() {
  return (
    <TardsStoreProvider>
      <TardsApp />
    </TardsStoreProvider>
  )
}
