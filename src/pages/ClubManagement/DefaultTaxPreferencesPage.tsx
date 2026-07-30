import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
  palette: {
    primary: { main: "#DA7756" },
    error: { main: "#DA7756" },
  },
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
  },
});

export const DefaultTaxPreferencesPage: React.FC = () => {
  const [intraStateTax, setIntraStateTax] = useState<string>("");
  const [interStateTax, setInterStateTax] = useState<string>("");
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

const [intraTaxes, setIntraTaxes] = useState<TaxGroup[]>([]);
const [interTaxes, setInterTaxes] = useState<TaxRate[]>([]);
 const lock_account_id = localStorage.getItem('lock_account_id');
 const baseUrl = localStorage.getItem('baseUrl');

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
      fetch(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_groups_view.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      }),
      fetch(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_rates.json?q[rate_type_eq]=IGST`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      }),
      fetch(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_settings.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
      }),
    ]);

    // INTRA → GROUPS
    if (groupResponse.ok) {
      const data = await groupResponse.json();
      setIntraTaxes(Array.isArray(data) ? data : (data?.data || []));
    }

    // INTER → RATES
    if (rateResponse.ok) {
      const data = await rateResponse.json();
      setInterTaxes(Array.isArray(data) ? data : (data?.data || []));
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
        `https://${baseUrl}/lock_accounts/${lock_account_id}/tax_settings.json`,
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


  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-8 bg-white min-h-[500px] w-full max-w-5xl mx-auto rounded-lg shadow-sm border mt-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Default Tax Preference
          </h1>
        </div>

        <style>{`
          .default-tax-form .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #DA7756 !important;
          }
          .default-tax-form .MuiInputLabel-root.Mui-focused {
            color: #DA7756 !important;
          }
        `}</style>
        <div className="default-tax-form max-w-4xl space-y-8">
          {/* Intra State Tax Rate */}
          <div className="flex flex-col w-full max-w-[360px]">
            <FormControl fullWidth margin="normal" disabled={loading}>
              <InputLabel id="intra-state-tax-label" shrink>
                Intra State Tax Rate<span style={{ color: "#C72030" }}>*</span>
              </InputLabel>
              <Select
                labelId="intra-state-tax-label"
                label="Intra State Tax Rate*"
                displayEmpty
                notched
                value={intraStateTax}
                onChange={(e) => setIntraStateTax(e.target.value)}
              >
                <MenuItem value="" disabled>Select tax rate</MenuItem>
                {intraTaxes.map((tax) => (
                  <MenuItem key={tax.id} value={String(tax.id)}>{tax.name}</MenuItem>
                ))}
                {intraTaxes.length === 0 && (
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
            <FormControl fullWidth margin="normal" disabled={loading}>
              <InputLabel id="inter-state-tax-label" shrink>
                Inter State Tax Rate<span style={{ color: "#C72030" }}>*</span>
              </InputLabel>
              <Select
                labelId="inter-state-tax-label"
                label="Inter State Tax Rate*"
                displayEmpty
                notched
                value={interStateTax}
                onChange={(e) => setInterStateTax(e.target.value)}
              >
                <MenuItem value="" disabled>Select tax rate</MenuItem>
                {interTaxes.map((tax) => (
                  <MenuItem key={tax.id} value={String(tax.id)}>{tax.name} [{tax.rate}%]</MenuItem>
                ))}
                {interTaxes.length === 0 && (
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
                style={{ backgroundColor: "#C72030" }}
                className="text-white hover:bg-[#C72030]/90 min-w-[100px] disabled:opacity-50"
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
