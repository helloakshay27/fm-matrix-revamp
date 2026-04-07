import { type FormEvent, useEffect, useState } from 'react';
import { AlertTriangle, CheckSquare, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type TaskEntryType = 'task' | 'issue';

/** Matches BugReports / WeeklyReports: warm panel `bg-[#fef6f4]`, `border-[#DA7756]/20`. */
export function AddTaskOrIssueDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [entryType, setEntryType] = useState<TaskEntryType>('task');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignTo, setAssignTo] = useState('me');
    const [priority, setPriority] = useState('medium');
    const [targetDate, setTargetDate] = useState('');

    useEffect(() => {
        if (!open) {
            setEntryType('task');
            setTitle('');
            setDescription('');
            setAssignTo('me');
            setPriority('medium');
            setTargetDate('');
        }
    }, [open]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onOpenChange(false);
    };

    const createBtnClass =
        entryType === 'task'
            ? 'bg-[#2563eb] hover:bg-[#2563eb]/90'
            : 'bg-amber-600 hover:bg-amber-600/90';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'max-h-[92vh] max-w-xl gap-0 overflow-y-auto rounded-2xl border-[#DA7756]/20 bg-[#fef6f4] p-0 sm:max-w-xl'
                )}
            >
                <div className="flex items-start justify-between border-b border-[#DA7756]/15 px-6 pb-4 pt-6 sm:px-8">
                    <DialogHeader className="space-y-0 text-left">
                        <DialogTitle className="text-xl font-bold text-neutral-900">
                            Add Task or Issue
                        </DialogTitle>
                    </DialogHeader>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1.5 text-neutral-500 hover:bg-[#f6f4ee] hover:text-neutral-900"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-5 sm:px-8">
                    <div className="space-y-2">
                        <Label className="text-sm text-neutral-700">
                            Type <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setEntryType('task')}
                                className={cn(
                                    'flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors',
                                    entryType === 'task'
                                        ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-sm'
                                        : 'border-[#DA7756]/25 bg-[#f6f4ee]/90 text-neutral-700 hover:border-[#DA7756]/35'
                                )}
                            >
                                <CheckSquare
                                    className={cn(
                                        'h-4 w-4 shrink-0',
                                        entryType === 'task' ? 'text-white' : 'text-neutral-400'
                                    )}
                                />
                                Task
                            </button>
                            <button
                                type="button"
                                onClick={() => setEntryType('issue')}
                                className={cn(
                                    'flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors',
                                    entryType === 'issue'
                                        ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                                        : 'border-[#DA7756]/25 bg-[#f6f4ee]/90 text-neutral-700 hover:border-[#DA7756]/35'
                                )}
                            >
                                <AlertTriangle
                                    className={cn(
                                        'h-4 w-4 shrink-0',
                                        entryType === 'issue' ? 'text-white' : 'text-neutral-400'
                                    )}
                                />
                                Issue
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="task-title" className="text-sm text-neutral-700">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief description"
                            required
                            className="h-11 w-full rounded-xl border border-[#DA7756]/20 bg-[#f6f4ee]/90 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="task-desc" className="text-sm text-neutral-700">
                            Description
                        </Label>
                        <Textarea
                            id="task-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description…"
                            className="min-h-[100px] resize-y rounded-xl border border-[#DA7756]/20 bg-[#f6f4ee]/90 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm text-neutral-700">
                            Assign To <span className="text-red-500">*</span>
                        </Label>
                        <Select value={assignTo} onValueChange={setAssignTo}>
                            <SelectTrigger className="h-11 rounded-xl border border-[#DA7756]/20 bg-[#f6f4ee]/90 shadow-sm">
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="me">Common Admin Id (Me)</SelectItem>
                                <SelectItem value="u1">Jane Smith</SelectItem>
                                <SelectItem value="u2">Ravi Kumar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-700">
                                Priority <span className="text-red-500">*</span>
                            </Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="h-11 rounded-xl border border-[#DA7756]/20 bg-[#f6f4ee]/90 shadow-sm">
                                    <SelectValue placeholder="Medium" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                                            Low
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                                            Medium
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="high">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                                            High
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="task-date" className="text-sm text-neutral-700">
                                Target Date <span className="text-red-500">*</span>
                            </Label>
                            <input
                                id="task-date"
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                required
                                className="h-11 w-full rounded-xl border border-[#DA7756]/20 bg-[#f6f4ee]/90 px-3 text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#DA7756]/15 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl border border-[#DA7756]/25 bg-[#fef6f4] px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-[#f6f4ee]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={cn(
                                'rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors',
                                createBtnClass
                            )}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
