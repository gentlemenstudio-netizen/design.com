import Link from "next/link";
import { Facebook, Instagram, Twitter, Github, ArrowRight } from "lucide-react";
import { Logo } from "@/app/(dashboard)/logo";
// Adjust path to your Logo component

export const Footer = () => {
    return (
        <footer className="bg-black text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Logo />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering creators with AI-driven branding tools. Start your journey from a single idea to a professional brand identity in minutes.
                        </p>
                        <div className="flex gap-x-4">
                            <Link href="#" className="text-gray-500 hover:text-white transition">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-white transition">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-white transition">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-brand-light">Design Tools</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition">Logo Maker</Link></li>
                            <li><Link href="/business-cards" className="hover:text-white transition opacity-50 cursor-not-allowed">Business Cards (Soon)</Link></li>
                            <li><Link href="/flyers" className="hover:text-white transition opacity-50 cursor-not-allowed">Flyers (Soon)</Link></li>
                            <li><Link href="/templates" className="hover:text-white transition">Browse Templates</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-brand-light">Resources</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Affiliate Program</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition">API Documentation</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-brand-light">Stay Updated</h4>
                        <p className="text-xs text-gray-400">Get design tips and new template alerts.</p>
                        <div className="flex gap-2">
                            <input
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-light w-full"
                            />
                            <button className="bg-brand-primary hover:bg-brand-light p-2 rounded-lg transition">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Gentlemen Studio. All rights reserved.
                    </p>
                    <div className="flex gap-x-6 text-xs text-gray-500">
                        <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
        
    );
};