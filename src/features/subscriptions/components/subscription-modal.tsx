"use client";

import Image from "next/image";
import { CheckCircle2, Download, ShieldCheck } from "lucide-react";

import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useSubscriptionModal } from "@/features/subscriptions/store/use-subscription-modal";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SubscriptionModal = () => {
  const mutation = useCheckout();
  const { isOpen, onClose } = useSubscriptionModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="h-2 bg-brand-primary w-full" />
        
        <div className="p-8">
            <DialogHeader className="flex items-center space-y-4">
            <div className="relative">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="drop-shadow-sm"
                />
            </div>
            
            <DialogTitle className="text-center text-2xl font-black tracking-tight text-slate-900">
                Download Your Logo
            </DialogTitle>
            <DialogDescription className="text-center font-medium text-slate-600">
                A subscription is required to export and download your high-resolution branding assets.
            </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-4">
                {/* Pricing Display */}
                <div className="text-center mb-6">
                    <span className="text-4xl font-black text-slate-900">Rs. 200</span>
                    <span className="text-slate-500 font-bold ml-1">/ month</span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <ul className="space-y-3">
                        <li className="flex items-center text-sm font-bold text-slate-700">
                            <CheckCircle2 className="size-5 mr-3 fill-brand-light text-white shrink-0" />
                            Unlimited High-Res Downloads
                        </li>
                        <li className="flex items-center text-sm font-bold text-slate-700">
                            <CheckCircle2 className="size-5 mr-3 fill-brand-light text-white shrink-0" />
                            SVG, PNG, & JPG Formats
                        </li>
                        <li className="flex items-center text-sm font-bold text-slate-700">
                            <CheckCircle2 className="size-5 mr-3 fill-brand-light text-white shrink-0" />
                            Full Commercial License
                        </li>
                    </ul>
                </div>
            </div>

            <DialogFooter className="pt-6 flex flex-col items-center gap-4">
              
                <Button
                    className="w-full bg-brand-primary hover:bg-brand-dark h-14 text-lg font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 group"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    Subscribe Now
                    <Download className="size-5 ml-2 group-hover:translate-y-0.5 transition-transform" />
                    <br/>
                </Button>
                
                {/* Fixed New Line Alignment */}
                
            </DialogFooter>
            <div className="text-center space-y-1 mt-3">
                    <p className="text-[11px] text-slate-500 font-bold flex items-center justify-center gap-1">
                        <ShieldCheck className="size-3 text-emerald-500" />
                        Secured by Stripe
                    </p>
                    <p className="block text-[11px] text-slate-400 font-medium italic">
                        Cancel your subscription anytime.
                    </p>
                </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};