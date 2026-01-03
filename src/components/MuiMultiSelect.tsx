// import {
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Select,
//     Chip,
// } from "@mui/material";
// import { SyntheticEvent } from "react";
// import CloseIcon from "@mui/icons-material/Close";

// interface Option {
//     label: string;
//     value: string | number;
//     id?: string | number;
// }

// interface MuiMultiSelectProps {
//     label?: string | JSX.Element;
//     options: Option[];
//     value?: Option[];
//     onChange?: (values: Option[]) => void;
//     error?: boolean;
//     helperText?: string;
//     placeholder?: string;
//     fullWidth?: boolean;
//     disabled?: boolean;
// }

// export const MuiMultiSelect = ({
//     label,
//     options,
//     value = [],
//     onChange,
//     error,
//     helperText,
//     placeholder,
//     fullWidth = true,
//     disabled = false,
// }: MuiMultiSelectProps) => {
//     const handleChange = (event: any) => {
//         const selectedValues = event.target.value;
//         const selectedOptions = (Array.isArray(selectedValues) ? selectedValues : []).map(
//             (val) => options.find((opt) => opt.value === val)
//         ).filter(Boolean) as Option[];

//         if (onChange) {
//             onChange(selectedOptions);
//         }
//     };

//     const handleDeleteChip = (chipValue: string | number) => {
//         const updatedValues = value.filter((item) => item.value !== chipValue);
//         if (onChange) {
//             onChange(updatedValues);
//         }
//     };

//     return (
//         <FormControl
//             fullWidth={fullWidth}
//             error={error}
//             variant="outlined"
//             sx={{
//                 "& .MuiInputBase-root": {
//                     minHeight: "45px",
//                     height: "auto",
//                 },
//             }}
//         >
//             <InputLabel shrink>{label}</InputLabel>
//             <Select
//                 multiple
//                 value={value.map((item) => item.value)}
//                 onChange={handleChange}
//                 label={label}
//                 disabled={disabled}
//                 displayEmpty
//                 MenuProps={{
//                     PaperProps: {
//                         style: {
//                             maxHeight: 300,
//                         },
//                     },
//                 }}
//                 renderValue={(selected) => (
//                     <div
//                         style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: "4px",
//                             padding: "4px 0",
//                         }}
//                     >
//                         {value.length > 0 ? (
//                             value.map((item) => (
//                                 <Chip
//                                     key={item.value}
//                                     label={item.label}
//                                     onDelete={() => handleDeleteChip(item.value)}
//                                     size="small"
//                                     variant="outlined"
//                                     onMouseDown={(e) => {
//                                         e.stopPropagation();
//                                     }}
//                                     sx={{
//                                         height: "20px",
//                                         fontSize: "0.7rem",
//                                         "& .MuiChip-label": {
//                                             padding: "0 6px",
//                                         },
//                                         "& .MuiChip-deleteIcon": {
//                                             fontSize: "14px",
//                                             margin: "0 2px 0 -4px",
//                                         },
//                                     }}
//                                 />
//                             ))
//                         ) : (
//                             <span style={{ color: "#999", lineHeight: "normal" }}>
//                                 {placeholder || "Select..."}
//                             </span>
//                         )}
//                     </div>
//                 )}
//                 sx={{
//                     "& .MuiSelect-select": {
//                         padding: "6px 12px !important",
//                         minHeight: "auto !important",
//                         display: "flex !important",
//                         alignItems: "flex-start",
//                         paddingTop: "8px !important",
//                         paddingBottom: "8px !important",
//                     },
//                     "& .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "rgba(0, 0, 0, 0.23)",
//                     },
//                 }}
//             >
//                 {options.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };

// export default MuiMultiSelect;





import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Chip,
} from "@mui/material";

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

const CHIP_ROW_HEIGHT = 28; // one line of chips
const MAX_VISIBLE_ROWS = 2;
const MAX_CHIP_CONTAINER_HEIGHT = CHIP_ROW_HEIGHT * MAX_VISIBLE_ROWS;

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

        const selectedOptions = (Array.isArray(selectedValues)
            ? selectedValues
            : []
        )
            .map((val) => options.find((opt) => opt.value === val))
            .filter(Boolean) as Option[];

        onChange?.(selectedOptions);
    };

    const handleDeleteChip = (chipValue: string | number) => {
        onChange?.(value.filter((item) => item.value !== chipValue));
    };

    return (
        <FormControl
            fullWidth={fullWidth}
            error={error}
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-root": {
                    alignItems: "flex-start",
                    minHeight: 72,
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
                        style: { maxHeight: 300 },
                    },
                }}
                renderValue={() => (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            maxHeight: MAX_CHIP_CONTAINER_HEIGHT,
                            overflowY: "auto",
                            alignItems: "center",
                        }}
                    >
                        {value.length > 0 ? (
                            value.map((item) => (
                                <Chip
                                    key={item.value}
                                    label={item.label}
                                    size="small"
                                    variant="outlined"
                                    onDelete={() => handleDeleteChip(item.value)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    sx={{
                                        height: 22,
                                        fontSize: "0.75rem",
                                        "& .MuiChip-label": {
                                            padding: "0 6px",
                                        },
                                    }}
                                />
                            ))
                        ) : (
                            <span style={{ color: "#999" }}>
                                {placeholder || "Select..."}
                            </span>
                        )}
                    </div>
                )}
                sx={{
                    "& .MuiSelect-select": {
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        padding: "10px 40px 10px 12px !important",
                    },

                    // keep arrow vertically aligned
                    "& .MuiSelect-icon": {
                        top: "calc(50% - 12px)",
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
