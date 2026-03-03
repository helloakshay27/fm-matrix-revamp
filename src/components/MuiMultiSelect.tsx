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
    maxHeight?: string | number;
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
    maxHeight = "65px",
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

    // Determine min height based on max height
    const minHeight = typeof maxHeight === 'string'
        ? (maxHeight === '36px' ? '36px' : '65px')
        : (maxHeight as number) < 50 ? '36px' : '65px';

    return (
        <FormControl
            fullWidth={fullWidth}
            error={error}
            variant="outlined"
            sx={{
                "& .MuiInputBase-root": {
                    minHeight: minHeight,
                    maxHeight: maxHeight,
                    height: "auto",
                },
                "& .MuiInputLabel-root": {
                    backgroundColor: "white",
                    padding: "0 4px",
                    marginLeft: "-2px",
                },
                "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                },
            }}
        >
            <InputLabel id="mui-multi-select-label" shrink>
                {label}
            </InputLabel>
            <Select
                multiple
                labelId="mui-multi-select-label"
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
                            gap: "3px",
                            padding: "2px 0",
                            maxHeight: maxHeight,
                            overflowY: "auto",
                            width: "100%",
                            scrollbarWidth: "none", // For Firefox
                            msOverflowStyle: "none", // For Internet Explorer and Edge
                        }}
                        className="custom-scrollbar"
                    >
                        <style>
                            {`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: transparent;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #e0e0e0;
                                    border-radius: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #bdbdbd;
                                }
                            `}
                        </style>
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
                                        height: "18px",
                                        fontSize: "0.65rem",
                                        "& .MuiChip-label": {
                                            padding: "0 5px",
                                        },
                                        "& .MuiChip-deleteIcon": {
                                            fontSize: "12px",
                                            margin: "0 1px 0 -3px",
                                        },
                                    }}
                                />
                            ))
                        ) : (
                            <span style={{ color: "#999", lineHeight: "normal", fontSize: "0.875rem" }}>
                                {placeholder || "Select..."}
                            </span>
                        )}
                    </div>
                )}
                sx={{
                    "& .MuiSelect-select": {
                        padding: "6px 12px !important",
                        minHeight: "45px !important",
                        display: "flex !important",
                        alignItems: "center",
                        paddingTop: "4px !important",
                        paddingBottom: "4px !important",
                        boxSizing: "border-box",
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
