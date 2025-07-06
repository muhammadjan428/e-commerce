import AdminNavbar from "@/components/AdminNavbar"
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNavbar />
      <main>{children}</main>
      <Toaster position="top-center" />
    </div>
  )
}
