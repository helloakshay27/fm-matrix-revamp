import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";

interface Tax {
  id: number;
  name: string;
  percentage: number;
}

export const DefaultTaxPreferencesPage: React.FC = () => {
  const [intraStateTax, setIntraStateTax] = useState<string>("");
  const [interStateTax, setInterStateTax] = useState<string>("");
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch both operations concurrently
      const [taxesResponse, settingsResponse] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL?.replace(/\/$/, "")}/lock_account_taxes.json?lock_account_id=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_CONFIG.TOKEN}`,
          },
        }),
        fetch(`https://club-uat-api.lockated.com/lock_accounts/1/tax_settings.json`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_CONFIG.TOKEN}`,
          },
        })
      ]);

      if (taxesResponse.ok) {
        const taxesData = await taxesResponse.json();
        setTaxes(taxesData);
      }

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        // Check if there is already an existing configuration response
        if (settingsData && settingsData.intra_state_tax_rate_id) {
          setIntraStateTax(String(settingsData.intra_state_tax_rate_id));
        }
        if (settingsData && settingsData.inter_state_tax_rate_id) {
          setInterStateTax(String(settingsData.inter_state_tax_rate_id));
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
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
          inter_state_tax_rate_id: parseInt(interStateTax)
        }
      };

      const response = await fetch(`https://club-uat-api.lockated.com/lock_accounts/1/tax_settings.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.TOKEN}`,
        },
        body: JSON.stringify(payload)
      });

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
    <div className="p-8 bg-white min-h-[500px] w-full max-w-5xl mx-auto rounded-lg shadow-sm border mt-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Default Tax Preference
        </h1>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Intra State Tax Rate */}
        <div className="flex flex-col w-full max-w-[360px]">
          <div className="relative pt-3">
            <label className="absolute left-3 top-0 px-1 bg-white text-[13px] text-[#C72030] whitespace-nowrap z-10">
              Intra State Tax Rate*
            </label>
            <select
              value={intraStateTax}
              onChange={(e) => setIntraStateTax(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-3 border border-gray-300 rounded text-[15px] text-gray-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-white shadow-sm transition appearance-none disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="" disabled>Select Tax</option>
              {taxes.map(tax => (
                <option key={tax.id} value={String(tax.id)}>{tax.name} [{tax.percentage}%]</option>
              ))}
            </select>
          </div>
          <p className="text-[13px] text-gray-500 mt-1.5 pl-1">
            (Within your State)
          </p>
        </div>

        {/* Inter State Tax Rate */}
        <div className="flex flex-col w-full max-w-[360px]">
          <div className="relative pt-3">
            <label className="absolute left-3 top-0 px-1 bg-white text-[13px] text-[#C72030] whitespace-nowrap z-10">
              Inter State Tax Rate*
            </label>
            <select
              value={interStateTax}
              onChange={(e) => setInterStateTax(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-3 border border-gray-300 rounded text-[15px] text-gray-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-white shadow-sm transition appearance-none disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="" disabled>Select Tax</option>
              {taxes.map(tax => (
                <option key={tax.id} value={String(tax.id)}>{tax.name} [{tax.percentage}%]</option>
              ))}
            </select>
          </div>
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
  );
};

export default DefaultTaxPreferencesPage;
