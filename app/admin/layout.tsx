import Navbar from '@/components/Navbar';
import '@/styles/globals.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar/>
        {children}
    </>
  );
}
