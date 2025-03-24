import Navbar from '@/components/Navbar';
import '@/styles/globals.css'

export default async function RootLayout({
  children
}) {
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
