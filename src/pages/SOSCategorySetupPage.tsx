import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

interface SOSCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "Id",
        sortable: true,
        draggable: true,
    },
    {
        key: "name",
        label: "Category Name",
        sortable: true,
        draggable: true,
    },
    {
        key: "created_at",
        label: "Created On",
        sortable: true,
        draggable: true,
    },
];

const SOSCategorySetupPage = () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [categories, setCategories] = useState<SOSCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://${baseUrl}/sos_directories/get_sos_directory_category.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories(response.data.sos_directory_categories || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `https://${baseUrl}/sos_directories/create_sos_directory_category.json`,
                {
                    name: categoryName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Category added successfully");
            setCategoryName("");
            setIsAddModalOpen(false);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to add category", error);
            toast.error("Failed to add category");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCell = (item: SOSCategory, columnKey: string) => {
        if (columnKey === "created_at") {
            return new Date(item.created_at).toLocaleDateString();
        }
        return item[columnKey as keyof SOSCategory] || "-";
    };

    const leftActions = (
        <Button
            onClick={() => setIsAddModalOpen(true)}
        >
            <Plus size={18} />
            Add Category
        </Button>
    )

    return (
        <div className="p-6">
            <EnhancedTable
                data={[...categories].reverse()}
                columns={columns}
                renderCell={renderCell}
                leftActions={leftActions}
                loading={loading}
                emptyMessage="No categories found"
                pagination={true}
                pageSize={10}
                hideTableSearch={true}
                hideColumnsButton={true}
                getItemId={(item: SOSCategory) => String(item.id)}
            />


            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddCategory();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddModalOpen(false);
                                setCategoryName("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCategory}
                            disabled={isSubmitting}
                            className="!bg-[#C72030] hover:bg-[#d0606e] !text-white"
                        >
                            {isSubmitting ? "Adding..." : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SOSCategorySetupPage;
