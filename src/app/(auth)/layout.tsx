import Image from 'next/image';
import Link from 'next/link';
import './auth-studio.css';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-studio"><div className="auth-studio-art"><Image src="/media/auth/glass-bloom.webp" alt="Sculptural glass flower in warm amber light" fill sizes="(max-width: 760px) 100vw, 55vw" priority/><div className="auth-studio-art-copy"><span>MADE FOR HUMAN IMAGINATION</span><h2>A little idea.<br/>A whole new world.</h2><p>Your creative space is waiting.</p></div></div><div className="auth-studio-form"><Link href="/" className="auth-back">← Back to inspiration</Link><span className="auth-spark" aria-hidden="true">✳</span><div>{children}</div><p className="auth-studio-note">IMAGINE IT. MAKE IT REAL.</p></div></div>;
}
