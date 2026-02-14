"use client";

import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useSubscriptionModal } from "@/features/subscriptions/store/use-subscription-modal";

export default function PricingPage() {

    const mutation = useCheckout();
    const { isOpen, onClose } = useSubscriptionModal();
    // Plan details for the single Pro offering
    const plan = {
        name: "Logo Pack",
        price: "Rs.200",
        period: "/month",
        description: "Everything you need to build and launch a professional brand.",
        features: [
            "Unlimited High-Resolution Downloads",
            "Vector Files (SVG) for large-scale printing",
            "Transparent PNGs for web & social media",
            "Full Commercial Usage Rights",
            "Business Card & Flyer Templates (Soon)",
            // "Priority AI Generation Speed",
        ],
    };

    const handleSubscribe = () => {
        // This is where you trigger your paywall (e.g., Stripe Checkout, LemonSqueezy, etc.)
        console.log("Redirecting to paywall...");
        // window.location.href = "YOUR_PAYWALL_LINK";
    };

    return (
        <div className="bg-black min-h-screen text-white py-24 px-4 overflow-hidden relative">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-full text-brand-primary text-xs font-black uppercase tracking-widest border border-brand-primary/20 mb-8">
                        <Sparkles className="size-4" />
                        Simple Transparent Pricing
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        One Plan. <br /> All Features.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto font-medium">
                        No hidden fees. Unlock every tool you need to create a world-class identity.
                    </p>
                </div>

                {/* Featured Single Card */}
                <div className="relative bg-[#0A0A0A] border border-brand-primary/30 rounded-[40px] p-8 md:p-12 shadow-[0_0_80px_rgba(155,27,27,0.1)] group">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Left Side: Pricing & Description */}
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-6xl font-black">{plan.price}</span>
                                <span className="text-gray-500 text-xl font-medium">{plan.period}</span>
                            </div>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                {plan.description}
                            </p>

                            <Button
                                onClick={() => mutation.mutate()}
                                disabled={mutation.isPending}
                                className="w-full h-16 rounded-2xl bg-brand-primary hover:bg-brand-hover text-white font-black text-xl transition-all active:scale-95 shadow-2xl shadow-red-900/20 flex items-center justify-center gap-3"
                            >
                                <Zap className="size-5 fill-current" />
                                Subscribe Now
                            </Button>
                            <p className="text-center text-gray-600 text-[10px] mt-4 uppercase tracking-widest font-bold">
                                Secure 256-bit SSL Encrypted Payment
                            </p>
                        </div>

                        {/* Right Side: Feature List */}
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">What&apos;s included:</h4>
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className="size-6 bg-brand-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="size-3 text-brand-primary" />
                                        </div>
                                        <span className="text-gray-300 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Bottom Proof */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale">
                    <span className="font-bold text-sm">STRIPE SECURE</span>
                    <span className="font-bold text-sm">100% MONEY BACK</span>
                    <span className="font-bold text-sm">CANCEL ANYTIME</span>
                </div>
            </div>
        </div>
    );
}