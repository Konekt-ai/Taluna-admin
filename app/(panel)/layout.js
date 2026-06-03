import { requireUser } from '@/lib/auth';
import AdminShell from '@/components/AdminShell';

// Layout de TODO el área privada. Si no hay sesión válida, requireUser()
// redirige a /login antes de renderizar nada.
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }) {
  const user = await requireUser();
  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
