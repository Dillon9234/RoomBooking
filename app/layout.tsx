import Navbar from '@/components/Navbar';
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
            <Navbar/>
            {children}
          </main> 
        </body>
        
    </html>
  );
}
