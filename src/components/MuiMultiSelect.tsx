import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Chip,
} from "@mui/material";
import { SyntheticEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Option {
    label: string;
    value: string | number;
    id?: string | number;
}

interface MuiMultiSelectProps {
    label?: string | JSX.Element;
    options: Option[];
    value?: Option[];
    onChange?: (values: Option[]) => void;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}

export const MuiMultiSelect = ({
    label,
    options,
    value = [],
    onChange,
    error,
    helperText,
    placeholder,
    fullWidth = true,
    disabled = false,
}: MuiMultiSelectProps) => {
    const handleChange = (event: any) => {
        const selectedValues = event.target.value;
        const selectedOptions = (Array.isArray(selectedValues) ? selectedValues : []).map(
            (val) => options.find((opt) => opt.value === val)
        ).filter(Boolean) as Option[];

        if (onChange) {
            onChange(selectedOptions);
        }
    };

    const handleDeleteChip = (chipValue: string | number) => {
        const updatedValues = value.filter((item) => item.value !== chipValue);
        if (onChange) {
            onChange(updatedValues);
        }
    };

    return (
        <FormControl
            fullWidth={fullWidth}
            error={error}
            variant="outlined"
            sx={{
                "& .MuiInputBase-root": {
                    minHeight: "45px",
                    height: "auto",
                },
            }}
        >
            <InputLabel shrink>{label}</InputLabel>
            <Select
                multiple
                value={value.map((item) => item.value)}
                onChange={handleChange}
                label={label}
                disabled={disabled}
                displayEmpty
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300,
                        },
                    },
                }}
                renderValue={(selected) => (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            padding: "4px 0",
                        }}
                    >
                        {value.length > 0 ? (
                            value.map((item) => (
                                <Chip
                                    key={item.value}
                                    label={item.label}
                                    onDelete={() => handleDeleteChip(item.value)}
                                    size="small"
                                    variant="outlined"
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                    }}
                                    sx={{
                                        height: "20px",
                                        fontSize: "0.7rem",
                                        "& .MuiChip-label": {
                                            padding: "0 6px",
                                        },
                                        "& .MuiChip-deleteIcon": {
                                            fontSize: "14px",
                                            margin: "0 2px 0 -4px",
                                        },
                                    }}
                                />
                            ))
                        ) : (
                            <span style={{ color: "#999", lineHeight: "normal" }}>
                                {placeholder || "Select..."}
                            </span>
                        )}
                    </div>
                )}
                sx={{
                    "& .MuiSelect-select": {
                        padding: "6px 12px !important",
                        minHeight: "auto !important",
                        display: "flex !important",
                        alignItems: "flex-start",
                        paddingTop: "8px !important",
                        paddingBottom: "8px !important",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MuiMultiSelect;
