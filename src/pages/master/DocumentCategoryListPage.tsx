import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { Plus, Pencil } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";

export interface DocumentCategory {
  id: number;
  name: string;
  description: string;
  active?: boolean;
}

const DocumentCategoryListPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/categories.json");
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch document categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [showActionPanel, setShowActionPanel] = useState(false);

  const handleAddCategory = () => {
    navigate("/master/document-category/add");
  };

  const handleEdit = (id: number) => {
    navigate(`/master/document-category/edit/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Categories</h1>
      </div>
      {showActionPanel && (
        <SelectionPanel
          actions={[{ label: "Add", icon: Plus, onClick: handleAddCategory }]}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <EnhancedTable
        loading={loading}
        columns={[
          { key: "srno", label: "Sr. No." },
          { key: "actions", label: "Actions" },
          { key: "name", label: "Category Name" },
          { key: "description", label: "Description" },
        ]}
        data={categories.map((category, idx) => ({
          ...category,
          srno: idx + 1,
        }))}
        leftActions={
          <Button
            onClick={() => setShowActionPanel((prev) => !prev)}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium mr-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button>
        }
        renderCell={(row, key) => {
          if (key === "srno") return <span>{row[key]}</span>;
          if (key === "actions") {
            return (
              <div className="flex gap-2 justify-center items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleEdit(row.id)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            );
          }
          if (key === "description") {
            return (
              <div className="max-w-md truncate" title={row[key]}>
                {row[key] || "N/A"}
              </div>
            );
          }
          return <span>{row[key] || "N/A"}</span>;
        }}
      />
    </div>
  );
};

export default DocumentCategoryListPage;
