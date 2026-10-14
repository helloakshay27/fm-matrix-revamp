import type { LucideIcon } from "lucide-react";

// Temporary content for tabs that haven't been built yet.
export function TabPlaceholder({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-brand" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">This section is coming soon.</p>
        </div>
    );
}
