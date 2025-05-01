// components/ui/Logo.tsx
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/dashboard" className="inline-block px-4 py-5 text-orange-500">
      <span className="text-4xl font-bold tracking-wider font-Squadaone">PRIME<span className='text-white'>DRIVE<span className='text-white'>.</span></span></span>
    </Link>
  );
};

export default Logo;