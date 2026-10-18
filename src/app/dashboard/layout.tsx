import { requireUser } from '@/lib/session';
import { getCatalog } from '@/lib/generation';
import { logout } from '@/app/actions/auth';
import { WorkspaceShell } from '@/components/workspace-shell';
import './studio-workspace.css';
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const services = await getCatalog();
  return <WorkspaceShell email={user.email} isAdmin={user.role === "admin"} creditBalance={user.creditBalance} services={services} logoutAction={logout}>{children}</WorkspaceShell>;
}
