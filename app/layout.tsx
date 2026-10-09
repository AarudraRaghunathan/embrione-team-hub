import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Embrione Team Hub', description: 'Meet the people building with The Embrione.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="container nav"><Link className="brand" href="/"><span className="brand-mark">E</span><span>THE EMBRIONE</span></Link><nav className="navlinks"><Link href="/team">Meet the team</Link><Link href="/register">Join us</Link><Link href="/admin">Admin</Link></nav></header>{children}<footer className="footer"><div className="container" style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><span>© {new Date().getFullYear()} The Embrione · PES University</span><span>Built for the Web Development Recruitment Challenge</span></div></footer></body></html>;
}
