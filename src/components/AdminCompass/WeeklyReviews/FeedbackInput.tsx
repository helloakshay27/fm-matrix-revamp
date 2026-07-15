import { Star } from 'lucide-react';

interface FeedbackInputProps {
    userId: number;
    feedbackText: string;
    score: number;
    isLoading: boolean;
    onFeedbackChange: (text: string) => void;
    onScoreChange: (score: number) => void;
    onSubmit: () => void;
}

export const FeedbackInput = ({
    userId,
    feedbackText,
    score,
    isLoading,
    onFeedbackChange,
    onScoreChange,
    onSubmit,
}: FeedbackInputProps) => {
    return (
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-colors focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100">
            <div className="flex min-w-0 items-center gap-2">
                <input
                    type="text"
                    placeholder="Feedback..."
                    value={feedbackText}
                    onChange={(e) => onFeedbackChange(e.target.value)}
                    className="h-9 min-w-0 flex-1 rounded-xl bg-transparent px-2 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
                <div className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const selected = star <= score;
                        return (
                            <button
                                key={star}
                                onClick={() => onScoreChange(star)}
                                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 ${
                                    selected
                                        ? 'border-amber-300 bg-amber-50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50'
                                }`}
                                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                                <Star
                                    className={`h-3.5 w-3.5 ${
                                        selected ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 px-4 text-[11px] font-black text-white shadow-sm transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Add
                </button>
            </div>
        </div>
    );
};
