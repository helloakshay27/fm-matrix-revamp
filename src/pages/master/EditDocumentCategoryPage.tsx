import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";

interface CategoryFormValues {
  name: string;
  description: string;
}

const EditDocumentCategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiClient.get(`/categories/${id}.json`);
        const category = response.data;
        reset({
          name: category.name || "",
          description: category.description || "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category data");
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const payload = {
        category: {
          name: data.name,
          description: data.description,
        },
      };
      await apiClient.put(`/categories/${id}.json`, payload);
      toast.success("Document category updated successfully");
      navigate("/master/document-category");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update document category");
    }
  };

  return (
    <div
      className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50"
      style={{ fontFamily: "Work Sans, sans-serif" }}
    >
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          EDIT DOCUMENT CATEGORY
        </h1>

        <div
          style={{
            padding: "24px",
            margin: 0,
            borderRadius: "3px",
            background: "#fff",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Category name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Category Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      placeholder="Enter category name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Description <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      placeholder="Enter description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/master/document-category")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDocumentCategoryPage;
