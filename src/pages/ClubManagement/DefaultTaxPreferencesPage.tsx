import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ListSubheader from "@mui/material/ListSubheader";

interface Tax {
  id: number;
  name: string;
  percentage: number;
}

interface TaxRate {
  id: number;
  name: string;
  percentage: number;
}

interface TaxGroup {
  id: number;
  name: string;
}
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafc", // Light gray background for the search area
          padding: "8px 12px",
          lineHeight: "normal",
        },
      },
    },
  },
});

export const DefaultTaxPreferencesPage: React.FC = () => {
  const [intraStateTax, setIntraStateTax] = useState<string>("");
  const [interStateTax, setInterStateTax] = useState<string>("");
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [intraSearch, setIntraSearch] = useState("");
  const [interSearch, setInterSearch] = useState("");

const [intraTaxes, setIntraTaxes] = useState<TaxGroup[]>([]);
const [interTaxes, setInterTaxes] = useState<TaxRate[]>([]);
 const lock_account_id = localStorage.getItem('lock_account_id');

  useEffect(() => {
    fetchInitialData();
  }, []);

  // const fetchInitialData = async () => {
  //   setLoading(true);
  //   try {
  //     // Fetch both operations concurrently
  //     const [taxesResponse, settingsResponse] = await Promise.all([
  //       fetch(
  //         `${API_CONFIG.BASE_URL?.replace(/\/$/, "")}/lock_account_taxes.json?lock_account_id=1`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${API_CONFIG.TOKEN}`,
  //           },
  //         }
  //       ),
  //       fetch(
  //         `https://club-uat-api.lockated.com/lock_accounts/1/tax_settings.json`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${API_CONFIG.TOKEN}`,
  //           },
  //         }
  //       ),
  //     ]);

  //     if (taxesResponse.ok) {
  //       const taxesData = await taxesResponse.json();
  //       setTaxes(taxesData);
  //     }

  //     if (settingsResponse.ok) {
  //       const settingsData = await settingsResponse.json();
  //       // Check if there is already an existing configuration response
  //       if (settingsData && settingsData.intra_state_tax_rate_id) {
  //         setIntraStateTax(String(settingsData.intra_state_tax_rate_id));
  //       }
  //       if (settingsData && settingsData.inter_state_tax_rate_id) {
  //         setInterStateTax(String(settingsData.inter_state_tax_rate_id));
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching initial data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



//   const fetchInitialData = async () => {
//   setLoading(true);

//   try {
//     const [intraResponse, interResponse, settingsResponse] = await Promise.all([
//       fetch(
//         `https://club-uat-api.lockated.com/lock_accounts/1/tax_rates.json`,
//         {
//           headers: {
//             Authorization: `Bearer ${API_CONFIG.TOKEN}`,
//           },
//         }
//       ),
//       fetch(
//         `https://club-uat-api.lockated.com/lock_accounts/1/tax_groups_view.json`,
//         {
//           headers: {
//             Authorization: `Bearer ${API_CONFIG.TOKEN}`,
//           },
//         }
//       ),
//       fetch(
//         `https://club-uat-api.lockated.com/lock_accounts/1/tax_settings.json`,
//         {
//           headers: {
//             Authorization: `Bearer ${API_CONFIG.TOKEN}`,
//           },
//         }
//       ),
//     ]);

//     if (intraResponse.ok) {
//       const data = await intraResponse.json();
//       setIntraTaxes(data);
//     }

//     if (interResponse.ok) {
//       const data = await interResponse.json();
//       setInterTaxes(data);
//     }

//     if (settingsResponse.ok) {
//       const settingsData = await settingsResponse.json();

//       if (settingsData?.intra_state_tax_rate_id) {
//         setIntraStateTax(String(settingsData.intra_state_tax_rate_id));
//       }

//       if (settingsData?.inter_state_tax_rate_id) {
//         setInterStateTax(String(settingsData.inter_state_tax_rate_id));
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching tax data:", error);
//   } finally {
//     setLoading(false);
//   }
// };


const fetchInitialData = async () => {
  setLoading(true);

  try {
    const [groupResponse, rateResponse, settingsResponse] = await Promise.all([
      fetch(`https://club-uat-api.lockated.com/lock_accounts/${lock_account_id}/tax_groups_view.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      }),
      fetch(`https://club-uat-api.lockated.com/lock_accounts/${lock_account_id}/tax_rates.json?q[rate_type_eq]=IGST`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      }),
      fetch(`https://club-uat-api.lockated.com/lock_accounts/${lock_account_id}/tax_settings.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      }),
    ]);

    // INTRA → GROUPS
    if (groupResponse.ok) {
      const data = await groupResponse.json();
      setIntraTaxes(data);
    }

    // INTER → RATES
    if (rateResponse.ok) {
      const data = await rateResponse.json();
      setInterTaxes(data);
    }

    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();

      if (settingsData?.intra_state_tax_rate_id) {
        setIntraStateTax(String(settingsData.intra_state_tax_rate_id));
      }

      if (settingsData?.inter_state_tax_rate_id) {
        setInterStateTax(String(settingsData.inter_state_tax_rate_id));
      }
    }
  } catch (error) {
    console.error("Error fetching tax data:", error);
  } finally {
    setLoading(false);
  }
};

  const handleSave = async () => {
    if (!intraStateTax || !interStateTax) {
      toast.error("Please select both Intra and Inter State Tax Rates.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tax_setting: {
          intra_state_tax_rate_id: parseInt(intraStateTax),
          inter_state_tax_rate_id: parseInt(interStateTax),
        },
      };

      const response = await fetch(
        `https://club-uat-api.lockated.com/lock_accounts/${lock_account_id}/tax_settings.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_CONFIG.TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Default Tax Preferences saved successfully!");
      } else {
        toast.error("Failed to save tax preferences.");
      }
    } catch (error) {
      console.error("Error saving tax preferences:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // const filteredIntraTaxes = useMemo(() => {
  //   return taxes.filter((t) =>
  //     t.name.toLowerCase().includes(intraSearch.toLowerCase())
  //   );
  // }, [taxes, intraSearch]);

  const filteredIntraTaxes = useMemo(() => {
  return intraTaxes.filter((t) =>
    t.name.toLowerCase().includes(intraSearch.toLowerCase())
  );
}, [intraTaxes, intraSearch]);

  // const filteredInterTaxes = useMemo(() => {
  //   return taxes.filter((t) =>
  //     t.name.toLowerCase().includes(interSearch.toLowerCase())
  //   );
  // }, [taxes, interSearch]);

  const filteredInterTaxes = useMemo(() => {
  return interTaxes.filter((t) =>
    t.name.toLowerCase().includes(interSearch.toLowerCase())
  );
}, [interTaxes, interSearch]);

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-8 bg-white min-h-[500px] w-full max-w-5xl mx-auto rounded-lg shadow-sm border mt-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Default Tax Preference
          </h1>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Intra State Tax Rate */}
          <div className="flex flex-col w-full max-w-[360px]">
            <FormControl size="small" fullWidth disabled={loading}>
              <InputLabel id="intra-state-tax-label">
                Intra State Tax Rate <span style={{ color: "#C72030" }}>*</span>
              </InputLabel>
              <Select
                labelId="intra-state-tax-label"
                id="intra-state-tax-select"
                value={intraStateTax}
                label={
                  <span>
                    Intra State Tax Rate{" "}
                    <span style={{ color: "#C72030" }}>*</span>
                  </span>
                }
                onChange={(e) => setIntraStateTax(e.target.value)}
                onClose={() => setIntraSearch("")}
                MenuProps={{ autoFocus: false }}
              >
                <ListSubheader disableSticky sx={{ p: 1, bgcolor: "#f1f5f9" }}>
                  <TextField
                    size="small"
                    autoFocus
                    placeholder="Type to search..."
                    fullWidth
                    value={intraSearch}
                    onChange={(e) => setIntraSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        borderColor: "#2563eb", // Matching the requested blue border for search
                        height: "40px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#bfdbfe", // blue-200 like color
                        borderWidth: "2px",
                        borderRadius: "8px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2563eb",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2563eb",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search
                            className="h-4 w-4"
                            style={{ color: "#7c3aed" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </ListSubheader>
                <MenuItem value="">
                  <span style={{ color: "#888" }}>Select</span>
                </MenuItem>
                {filteredIntraTaxes.map((tax) => (
                  <MenuItem key={tax.id} value={String(tax.id)}>
                    {tax.name} 
                    {/* [{tax.percentage}%] */}
                  </MenuItem>
                ))}
                {filteredIntraTaxes.length === 0 && (
                  <MenuItem disabled>No tax found.</MenuItem>
                )}
              </Select>
            </FormControl>
            <p className="text-[13px] text-gray-500 mt-1.5 pl-1">
              (Within your State)
            </p>
          </div>

          {/* Inter State Tax Rate */}
          <div className="flex flex-col w-full max-w-[360px]">
            <FormControl size="small" fullWidth disabled={loading}>
              <InputLabel id="inter-state-tax-label">
                Inter State Tax Rate <span style={{ color: "#C72030" }}>*</span>
              </InputLabel>
              <Select
                labelId="inter-state-tax-label"
                id="inter-state-tax-select"
                value={interStateTax}
                label={
                  <span>
                    Inter State Tax Rate{" "}
                    <span style={{ color: "#C72030" }}>*</span>
                  </span>
                }
                onChange={(e) => setInterStateTax(e.target.value)}
                onClose={() => setInterSearch("")}
                MenuProps={{ autoFocus: false }}
              >
                <ListSubheader disableSticky sx={{ p: 1, bgcolor: "#f1f5f9" }}>
                  <TextField
                    size="small"
                    autoFocus
                    placeholder="Type to search..."
                    fullWidth
                    value={interSearch}
                    onChange={(e) => setInterSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#bfdbfe",
                        borderWidth: "2px",
                        borderRadius: "8px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2563eb",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2563eb",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search
                            className="h-4 w-4"
                            style={{ color: "#7c3aed" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </ListSubheader>
                <MenuItem value="">
                  <span style={{ color: "#888" }}>Select</span>
                </MenuItem>
                {filteredInterTaxes.map((tax) => (
                  <MenuItem key={tax.id} value={String(tax.id)}>
                    {tax.name} [{tax.rate}%]
                  </MenuItem>
                ))}
                {filteredInterTaxes.length === 0 && (
                  <MenuItem disabled>No tax found.</MenuItem>
                )}
              </Select>
            </FormControl>
            <p className="text-[13px] text-gray-500 mt-1.5 pl-1">
              (Outside your State)
            </p>
          </div>

          <div className="pt-8">
            <div className="bg-gray-50 border border-gray-100 rounded p-4 mb-8">
              <p className="text-[13px] text-gray-600">
                <span className="font-semibold text-gray-900 mr-1">Note :</span>
                Clicking Save will update the tax rates for all items except for
                the ones that you've manually changed under the Items module.
              </p>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#F6EEE5] hover:bg-[#EBDDD0] text-[#C72030] font-semibold px-8 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DefaultTaxPreferencesPage;
