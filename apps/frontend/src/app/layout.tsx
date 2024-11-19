import Link from 'next/link'
import "./globals.css";
import {ConfigureAmplify} from '@/components/';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <ConfigureAmplify/>
        <div className='flex gap-2 px-4 py-2 bg-orange-400'>
          <Link href="/">Home</Link>
          <Link href="/user">User</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
