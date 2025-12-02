import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks"
import { createCircle, fetchCircleList, updateCircle } from "@/store/slices/msafeCircleSlice"
import { Dialog, DialogContent, TextField } from "@mui/material"
import { Edit, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "name",
        label: "Circle Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "active",
        label: "Active",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const MsafeCirlce = () => {
    const dispatch = useAppDispatch()
    const token = localStorage.getItem("token")
    const baseUrl = localStorage.getItem("baseUrl")

    const [circleList, setCircleList] = useState([])
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [circle, setCircle] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [record, setRecord] = useState<{ name: string, id: string }>({ name: "", id: "" })

    const getCircleList = async () => {
        setLoading(true)
        try {
            const response = await dispatch(fetchCircleList({ baseUrl, token })).unwrap();
            setCircleList(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCircleList()
    }, [])

    useEffect(() => {
        if (isEditing && record) {
            setCircle(record.name);
        }
    }, [isEditing, record]);

    const handleCheckboxChange = async (item: any) => {
        const newStatus = !item.active;
        const itemId = item.id;

        if (updatingStatus[itemId]) return;

        try {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

            await dispatch(
                updateCircle({
                    baseUrl,
                    token,
                    id: itemId,
                    data: {
                        circle: {
                            active: newStatus,
                        },
                    },
                })
            ).unwrap();

            setCircleList((prevData: any[]) =>
                prevData.map((row) =>
                    row.id === itemId ? { ...row, active: newStatus } : row
                )
            );

            toast.success(`Circle ${newStatus ? "activated" : "deactivated"} successfully`);
        } catch (error) {
            console.error("Error updating active status:", error);
            toast.error(error || "Failed to update active status. Please try again.");
        } finally {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (isEditing) {
                await dispatch(
                    updateCircle({
                        baseUrl,
                        token,
                        id: record.id,
                        data: {
                            circle: {
                                name: circle,
                            },
                        },
                    })
                ).unwrap();
                toast.success("Circle updated successfully")
                setIsEditing(false)
                handleClose()
            } else {
                await dispatch(
                    createCircle({
                        baseUrl,
                        token,
                        data: {
                            circle: {
                                name: circle,
                                active: true
                            },
                        },
                    })
                ).unwrap();
                toast.success("Circle created successfully")
                handleClose()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
            getCircleList()
        }
    }

    const handleClose = () => {
        setIsAddModalOpen(false);
        setIsEditing(false)
        setRecord({
            name: "",
            id: ""
        })
        setCircle("")
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "active":
                return (
                    <Switch
                        checked={item.active}
                        onCheckedChange={() =>
                            handleCheckboxChange(item)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        disabled={updatingStatus[item.id]}
                    />
                );
            default:
                return item[columnKey] || "-";
        }
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setIsAddModalOpen(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    const renderActions = (item: any) => {
        return (
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => {
                    setIsEditing(true)
                    setRecord(item)
                    setIsAddModalOpen(true)
                }}
            >
                <Edit className="w-4 h-4" />
            </Button>
        )
    };

    return (
        <div className="p-6">
            <EnhancedTable
                data={circleList}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                leftActions={leftActions}
                storageKey="msafe-circle-table"
                emptyMessage="No data found"
                loading={loading}
            />


            <Dialog open={isAddModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <div>
                        <h1 className='text-xl mb-6 mt-2 font-semibold'>{isEditing ? 'Edit Circle' : 'Add Circle'}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            label="Circle Name*"
                            name="circleName"
                            value={circle}
                            onChange={(e) => setCircle(e.target.value)}
                            type='text'
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                            sx={{ mt: 1 }}
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                                disabled={submitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MsafeCirlce