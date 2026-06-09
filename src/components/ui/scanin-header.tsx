"use client"
import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Cara Kerja', href: '#cara-kerja' },
]

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-500 dark:text-gray-400';
  const hoverTextColor = 'text-black dark:text-white';
  const textSizeClass = 'text-sm font-medium';

  return (
    <Link href={href} className={`group/navlink relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover/navlink:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export const ScaninHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { isAuthenticated, user, logout } = useAuth()
    const router = useRouter()

    const handleScanClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        if (isAuthenticated) {
            router.push('/scan')
        } else {
            router.push('/sign-in')
        }
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
        <header>
            <nav
                data-state={menuState ? 'active' : 'closed'}
                className="fixed top-0 left-0 z-50 w-full px-2 group mt-2 sm:mt-4">
                <div className={cn('mx-auto max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 dark:bg-black/50 max-w-4xl rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                                <Logo />
                                <span className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider hidden sm:block">Scanin</span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-medium">
                                {menuItems.map((item, index) => (
                                    <li key={index} className="flex items-center">
                                        <AnimatedNavLink href={item.href}>
                                            {item.name}
                                        </AnimatedNavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-black group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent dark:lg:border-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base font-medium">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <AnimatedNavLink href={item.href}>
                                                {item.name}
                                            </AnimatedNavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit sm:items-center">
                                {isAuthenticated ? (
                                    <>
                                        <Link 
                                            href="/scan"
                                            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-br from-gray-100 to-gray-300 text-black px-4 text-sm font-semibold transition-colors hover:from-white hover:to-gray-200"
                                        >
                                            <span>Mulai Scan</span>
                                        </Link>
                                        <div className="relative group hidden sm:block">
                                            <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-gray-800 focus:outline-none transition-transform group-hover:scale-105">
                                                {user?.avatar_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={user.avatar_url} alt={user?.name || "Profile"} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-300">
                                                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                    </span>
                                                )}
                                            </button>
                                            <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2">
                                                <div className="rounded-xl border border-[#333] bg-[#111] p-2 shadow-xl">
                                                    <div className="px-3 py-2 text-xs text-gray-400 border-b border-[#333] mb-1 truncate">
                                                        {user?.email}
                                                    </div>
                                                    <button 
                                                        onClick={() => logout()}
                                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Keluar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Mobile Logout Button */}
                                        <button 
                                            onClick={() => logout()}
                                            className="sm:hidden inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-red-900 bg-red-950/30 text-red-400 px-4 text-sm font-medium transition-colors hover:bg-red-900/50"
                                        >
                                            <span>Keluar</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/sign-in"
                                            className={cn("inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 px-4 text-sm font-medium transition-colors hover:border-white/50 hover:text-white", isScrolled && 'lg:hidden')}
                                        >
                                            <span>Masuk</span>
                                        </Link>
                                        <Link 
                                            href="/sign-up"
                                            className={cn("inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-br from-gray-100 to-gray-300 text-black px-4 text-sm font-semibold transition-colors hover:from-white hover:to-gray-200", isScrolled && 'lg:hidden')}
                                        >
                                            <span>Daftar</span>
                                        </Link>
                                        <Link 
                                            href="/scan"
                                            onClick={handleScanClick}
                                            className={cn("inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-br from-gray-100 to-gray-300 text-black px-4 text-sm font-semibold transition-colors hover:from-white hover:to-gray-200", isScrolled ? 'lg:inline-flex' : 'hidden')}
                                        >
                                            <span>Mulai Scan</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

import { ScanLine } from 'lucide-react'

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative flex items-center justify-center h-7 sm:h-8", className)}>
            <svg
                width="40"
                height="20"
                viewBox="0 0 48 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white transition-transform duration-300 group-hover:scale-105 w-8 h-4 sm:w-12 sm:h-6"
                style={{ filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5))' }}
            >
                <path
                    d="M 6 18 C 10 18 16 6 12 6 C 8 6 6 14 10 18 C 14 22 18 12 22 12 C 24 12 26 18 30 18 C 34 18 38 12 42 10"
                    stroke="url(#gradient-logo)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <defs>
                    <linearGradient id="gradient-logo" x1="6" y1="6" x2="42" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ffffff" />
                        <stop offset="1" stopColor="#9ca3af" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
