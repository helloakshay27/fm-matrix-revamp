import { useRef } from "react";

export interface DepartmentUser {
    id?: number | string;
    value?: number | string;
    full_name?: string;
    label?: string;
    department_id?: number | string | null;
    department_name?: string | null;
    [key: string]: any;
}

/**
 * Renders a department-checkbox tree for a list of users: one checkbox per
 * department (selects/deselects every user in that department at once) with
 * each individual user nested underneath as its own checkbox. Used for the
 * Responsible Person / Assignee filters, where the users API response groups
 * each user under a department_id/department_name.
 */
export function GroupedUserCheckboxList({
    users,
    selected,
    setSelected,
    searchTerm = "",
}: {
    users: DepartmentUser[];
    selected: any[];
    setSelected: (selected: any[]) => void;
    searchTerm?: string;
}) {
    const term = searchTerm.toLowerCase();

    const normalized = users.map((u) => ({
        id: u.id ?? u.value,
        name: u.full_name ?? u.label ?? "",
        departmentId: String(u.department_id ?? "unassigned"),
        departmentName: u.department_name || "Unassigned",
    }));

    const filtered = normalized.filter(
        (u) =>
            u.name.toLowerCase().includes(term) ||
            u.departmentName.toLowerCase().includes(term)
    );

    const groups = new Map<string, { name: string; users: typeof filtered }>();
    filtered.forEach((u) => {
        if (!groups.has(u.departmentId)) {
            groups.set(u.departmentId, { name: u.departmentName, users: [] });
        }
        groups.get(u.departmentId)!.users.push(u);
    });

    const toggleUser = (id: any) => {
        setSelected(
            selected.includes(id)
                ? selected.filter((v) => v !== id)
                : [...selected, id]
        );
    };

    const toggleDepartment = (deptUsers: typeof filtered) => {
        const ids = deptUsers.map((u) => u.id);
        const allSelected = ids.every((id) => selected.includes(id));
        setSelected(
            allSelected
                ? selected.filter((v) => !ids.includes(v))
                : Array.from(new Set([...selected, ...ids]))
        );
    };

    if (groups.size === 0) {
        return (
            <div className="text-center text-gray-400 text-sm py-2">
                No results found
            </div>
        );
    }

    return (
        <div className="max-h-56 overflow-y-auto p-2">
            {Array.from(groups.entries()).map(([deptId, group]) => {
                const ids = group.users.map((u) => u.id);
                const selectedCount = ids.filter((id) =>
                    selected.includes(id)
                ).length;
                const allSelected = selectedCount === ids.length && ids.length > 0;
                const someSelected = selectedCount > 0 && !allSelected;

                return (
                    <div key={deptId} className="mb-1">
                        <label className="flex items-center gap-2 py-2 px-2 text-sm font-semibold cursor-pointer hover:bg-gray-50 rounded">
                            <DepartmentCheckbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={() => toggleDepartment(group.users)}
                            />
                            <span>{group.name}</span>
                        </label>
                        <div className="ml-5">
                            {group.users.map((u) => (
                                <label
                                    key={u.id}
                                    className="flex items-center gap-2 py-1.5 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(u.id)}
                                        onChange={() => toggleUser(u.id)}
                                    />
                                    <span>{u.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/** Plain checkbox input that also reflects the native `indeterminate` state
 * (partial department selection), which isn't settable via a JSX prop. */
function DepartmentCheckbox({
    checked,
    indeterminate,
    onChange,
}: {
    checked: boolean;
    indeterminate: boolean;
    onChange: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <input
            ref={(el) => {
                ref.current = el;
                if (el) el.indeterminate = indeterminate;
            }}
            type="checkbox"
            checked={checked}
            onChange={onChange}
        />
    );
}

/** Non-JSX helper for call sites that build their checkbox lists via a
 * function (e.g. `renderCheckboxList(...)`) rather than a component. */
export function renderGroupedUserCheckboxList(
    users: DepartmentUser[],
    selected: any[],
    setSelected: (selected: any[]) => void,
    searchTerm: string = ""
) {
    return (
        <GroupedUserCheckboxList
            users={users}
            selected={selected}
            setSelected={setSelected}
            searchTerm={searchTerm}
        />
    );
}
