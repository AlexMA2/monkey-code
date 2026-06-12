"use client";

import React, {
    Suspense,
    useEffect,
    useState,
    useTransition,
    useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar, { SettingCategory } from "@components/Sidebar";
import CursorSettings from "@components/CursorSettings";
import FontSettings from "@components/FontSettings";
import CommonSettings from "@components/CommonSettings";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/_constants/routes";

const TAB_TO_CATEGORY: Record<string, SettingCategory> = {
    CommonlyUsed: "common",
    CursorSettings: "cursor",
    FontLayout: "font",
};

const CATEGORY_TO_TAB: Record<SettingCategory, string> = {
    common: "CommonlyUsed",
    cursor: "CursorSettings",
    font: "FontLayout",
};

function getCategoryFromTab(tab: string | null): SettingCategory {
    return (tab && TAB_TO_CATEGORY[tab]) || "common";
}

function SettingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const [optimisticCategory, setOptimisticCategory] = useState<SettingCategory>(
        getCategoryFromTab(tabParam),
    );

    const [isPending, startTransition] = useTransition();
    const [showSpinner, setShowSpinner] = useState(false);
    const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setOptimisticCategory(getCategoryFromTab(tabParam));
    }, [tabParam]);

    useEffect(() => {
        if (isPending) {
            spinnerTimerRef.current = setTimeout(() => setShowSpinner(true), 1000);
        } else {
            if (spinnerTimerRef.current) {
                clearTimeout(spinnerTimerRef.current);
                spinnerTimerRef.current = null;
            }
            setShowSpinner(false);
        }
        return () => {
            if (spinnerTimerRef.current) clearTimeout(spinnerTimerRef.current);
        };
    }, [isPending]);

    useEffect(() => {
        if (tabParam) {
            localStorage.setItem("last_settings_tab", tabParam);
        }
    }, [tabParam]);

    useEffect(() => {
        if (!tabParam) {
            const savedTab = localStorage.getItem("last_settings_tab");
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", savedTab || "CommonlyUsed");
            router.replace(`${ROUTES.SETTINGS}?${params.toString()}`);
        }
    }, [tabParam, searchParams, router]);

    const setActiveCategory = (category: SettingCategory) => {
        setOptimisticCategory(category);

        startTransition(() => {
            const tabName = CATEGORY_TO_TAB[category];
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tabName);
            router.replace(`${ROUTES.SETTINGS}?${params.toString()}`);
        });
    };

    if (!tabParam) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[500px] text-foreground/70 animate-in fade-in duration-200">
                <Loader2 className="w-6 h-6 animate-spin text-accent mr-2" />
                Loading settings...
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col justify-center  relative z-10 animate-in fade-in duration-200">
            <div className="w-full max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8 min-h-[500px]">
                {/* Sidebar Navigation */}
                <Sidebar
                    activeCategory={optimisticCategory}
                    setActiveCategory={setActiveCategory}
                />

                {/* Settings Grid Content */}
                <div className="flex-1 overflow-y-auto relative">
                    {showSpinner && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm rounded-xl">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        </div>
                    )}
                    {optimisticCategory === "cursor" && <CursorSettings />}
                    {optimisticCategory === "font" && <FontSettings />}
                    {optimisticCategory === "common" && <CommonSettings />}
                </div>
            </div>
        </main>
    );
}

export default function Settings() {
    return (
        <Suspense
            fallback={
                <div className="flex-1 flex items-center justify-center min-h-[500px] text-foreground/70">
                    <Loader2 className="w-6 h-6 animate-spin text-accent mr-2" />
                    Loading settings...
                </div>
            }
        >
            <SettingsContent />
        </Suspense>
    );
}
