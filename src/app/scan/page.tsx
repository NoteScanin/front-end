import { NoteScannerUI } from "@/components/ui/note-scanner-ui";
import { ScaninHeader } from "@/components/ui/scanin-header";

export default function ScanPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
            <ScaninHeader />

            <div className="pt-32 pb-16 px-4 md:px-8">
                <NoteScannerUI />
            </div>

            {/* Background elements to match the existing premium vibe */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black/[0.02] dark:from-white/[0.02] to-transparent pointer-events-none -z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20" />
        </main>
    );
}
