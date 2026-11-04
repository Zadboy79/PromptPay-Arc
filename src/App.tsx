import Landing from '@/pages/Landing'
import Workspace from '@/pages/Workspace'
import { usePath } from '@/lib/router'

export default function App() {
  const path = usePath()
  // Unknown paths fall back to the landing page, so any shared link opens somewhere useful.
  return path.replace(/\/+$/, '') === '/app' ? <Workspace /> : <Landing />
}
