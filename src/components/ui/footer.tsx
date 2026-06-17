'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Produk',
		links: [
			{ title: 'Beranda', href: '/' },
			{ title: 'Mulai Scan', href: '/scan' },
			{ title: 'Harga', href: '#pricing' },
			{ title: 'API Integrasi', href: '#' },
		],
	},
	{
		label: 'Perusahaan',
		links: [
			{ title: 'Tentang Kami', href: '/about' },
			{ title: 'FAQ', href: '/faqs' },
			{ title: 'Kebijakan Privasi', href: '/privacy' },
			{ title: 'Syarat & Ketentuan', href: '/terms' },
		],
	},
	{
		label: 'Sumber Daya',
		links: [
			{ title: 'Panduan Penggunaan', href: '/guide' },
			{ title: 'Blog', href: '/blog' },
			{ title: 'Pusat Bantuan', href: '/help' },
			{ title: 'Status Sistem', href: '/status' },
		],
	},
	{
		label: 'Sosial Media',
		links: [
			{ title: 'Instagram', href: '#', icon: FaInstagram },
			{ title: 'LinkedIn', href: '#', icon: FaLinkedin },
			{ title: 'YouTube', href: '#', icon: FaYoutube },
			{ title: 'GitHub', href: '#', icon: FaGithub },
		],
	},
];

export function Footer() {
	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-black/5 dark:border-white/5 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.black/5%),transparent)] dark:bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16 mt-auto">
			<div className="bg-black/10 dark:bg-white/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="bg-black dark:bg-white w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <svg
                                width="24"
                                height="12"
                                viewBox="0 0 48 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-white dark:text-black w-6 h-auto"
                            >
                                <path
                                    d="M 6 18 C 10 18 16 6 12 6 C 8 6 6 14 10 18 C 14 22 18 12 22 12 C 24 12 26 18 30 18 C 34 18 38 12 42 10"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-black dark:text-white">Scanin</span>
                    </div>
					<p className="text-black/60 dark:text-white/60 mt-8 text-sm md:mt-4 max-w-xs leading-relaxed">
						Ubah catatan tulisan tanganmu menjadi dokumen digital yang rapi dan terstruktur dalam hitungan detik menggunakan AI.
					</p>
					<p className="text-black/40 dark:text-white/40 text-sm mt-8">
						© {new Date().getFullYear()} Scanin. Hak cipta dilindungi.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-sm font-semibold text-black dark:text-white">{section.label}</h3>
								<ul className="text-black/60 dark:text-white/60 mt-4 space-y-3 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-black dark:hover:text-white inline-flex items-center transition-all duration-300 group"
											>
												{link.icon && <link.icon className="me-2 size-4 opacity-70 group-hover:opacity-100 transition-opacity" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: 8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay, duration: 0.6, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
