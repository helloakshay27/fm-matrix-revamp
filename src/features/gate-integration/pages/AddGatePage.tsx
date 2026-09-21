import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GateForm } from "../components/GateForm";
import type { AddGateFormData } from "../schemas/addGateSchema";
import { useCreateSocietyGateMutation } from "../hooks/useCreateSocietyGateMutation";

const AddGatePage = () => {
  const navigate = useNavigate();
  const createGate = useCreateSocietyGateMutation();

  const handleSubmit = (values: AddGateFormData) => {
    createGate.mutate(
      {
        gate_name: values.gateName,
        gate_device: values.gateDevice,
        // The confirmed create payload has no site (resource_id) field —
        // the Tower selection is sent as both society_block_id and
        // building_id (confirmed via curl, where both carried the same id).
        society_block_id: Number(values.tower),
        building_id: Number(values.tower),
        user_id: Number(values.user),
      },
      {
        onSuccess: () => {
          toast.success("Gate added successfully");
          navigate("/ops-console/settings/gate-integration");
        },
        onError: () => {
          toast.error("Failed to add gate. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>

        <GateForm
          onSubmit={handleSubmit}
          isSubmitting={createGate.isPending}
          submitLabel="Submit"
          submittingLabel="Submitting..."
        />
      </div>
    </div>
  );
};

export default AddGatePage;
