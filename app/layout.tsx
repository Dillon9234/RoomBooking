import '@/styles/globals.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className='bg-black text-white'>
          <main>
            {children}
          </main> 
        </body>
        
    </html>
  );
}
