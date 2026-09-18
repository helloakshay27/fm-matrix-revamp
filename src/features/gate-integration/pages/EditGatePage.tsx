import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GateForm } from "../components/GateForm";
import type { AddGateFormData } from "../schemas/addGateSchema";
import type { SocietyGateApiItem } from "../types/societyGate";
import { useUpdateSocietyGateMutation } from "../hooks/useUpdateSocietyGateMutation";

const EditGatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  // The list page already has full gate details, so it's passed along via
  // router state rather than fetching by id — no single-gate GET endpoint
  // has been confirmed.
  const gate = (location.state as { gate?: SocietyGateApiItem } | null)?.gate;

  const updateGate = useUpdateSocietyGateMutation();

  const handleBack = () => navigate("/ops-console/settings/gate-integration");

  if (!gate) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <p className="text-sm text-gray-600">
            Gate details aren't available. Please go back to the list and try editing again.
          </p>
        </div>
      </div>
    );
  }

  const defaultValues: Partial<AddGateFormData> = {
    site: String(gate.resource_id),
    tower: gate.building_id != null ? String(gate.building_id) : "",
    user: gate.user_id != null ? String(gate.user_id) : "",
    gateName: gate.gate_name ?? "",
    gateDevice: gate.gate_device ?? "",
  };

  const handleSubmit = (values: AddGateFormData) => {
    updateGate.mutate(
      {
        id: Number(id),
        payload: {
          gate_name: values.gateName,
          gate_device: values.gateDevice,
          society_block_id: Number(values.tower),
          building_id: Number(values.tower),
          user_id: Number(values.user),
        },
      },
      {
        onSuccess: () => {
          toast.success("Gate updated successfully");
          handleBack();
        },
        onError: () => {
          toast.error("Failed to update gate. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>

        <GateForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={updateGate.isPending}
          submitLabel="Update"
          submittingLabel="Updating..."
        />
      </div>
    </div>
  );
};

export default EditGatePage;
