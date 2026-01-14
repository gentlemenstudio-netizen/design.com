"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessCardsHomePage() {
    const [brand, setBrand] = useState("");
    const router = useRouter();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-bold">Create your business cards</h1>

            <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter your brand name"
                className="border rounded px-4 py-3 w-full max-w-md text-lg"
            />

            <button
                onClick={function () {
                    router.push(`/business-cards/templates?brand=${encodeURIComponent(brand)}`)
                    router.refresh();
                }}
                disabled={!brand.trim()}
                className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
            >
                Generate business cards
            </button>
        </div>
    );
}
