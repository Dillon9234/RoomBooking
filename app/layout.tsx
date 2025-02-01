import '@/styles/globals.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className='bg-black'>
          <main>
            {children}
          </main> 
        </body>
        
    </html>
  );
}
