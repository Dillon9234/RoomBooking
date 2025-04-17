import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthContext';
import '@/styles/globals.css'

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className='bg-black text-white'>
          <main>
            <AuthProvider>
              <Navbar/>
              {children}
            </AuthProvider>
          </main> 
        </body>
        
    </html>
  );
}
