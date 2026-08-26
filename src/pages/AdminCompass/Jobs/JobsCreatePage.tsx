// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useJobs } from "./JobsContext";
import { T } from "./constants";
import { I, ico } from "./icons";
import { Btn } from "./components/UI";
import Stepper from "./components/Stepper";
import { StepDetails, StepDesc, StepKra, StepKpi, StepReview } from "./components/JobFormSteps";
import { useCreateJob } from "./hooks/useCreateJob";
import { useDepartments } from "./hooks/useDepartments";
import { buildJobPayload } from "./api/jobsApi";

export default function JobsCreatePage() {
  const navigate = useNavigate();
  const {
    step, setStep, nextBlockReason, createBlockReason,
    jobForm, formKras, formKpis, resetCreate,
  } = useJobs();
  const createJob = useCreateJob({
    onSuccess: () => {
      toast.success("Job description created successfully");
      resetCreate();
      navigate("/admin-compass/jobs");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create job description");
    },
  });
  const { data: departments } = useDepartments();

  const handleCancel = () => {
    resetCreate();
    navigate("/admin-compass/jobs");
  };

  const handleSave = () => {
    const payload = buildJobPayload(jobForm, formKras, formKpis, departments ?? []);
    createJob.mutate(payload);
  };

  // Saare steps ka mandatory data poora hone par hi Save enable hota hai.
  const continueBlockReason = nextBlockReason();
  const saveBlockReason = createBlockReason();
  const isFormComplete = !saveBlockReason;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: T.inkMuted,
            fontSize: 12.5,
            fontWeight: 600,
            fontFamily: T.font,
            marginBottom: 8,
            padding: 0,
          }}
          onClick={handleCancel}
        >
          {ico.arrowLeft} Back to all JDs
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          Create Job Description
        </h1>
        <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, fontWeight: 400, lineHeight: 1.6 }}>
          Define the role, describe the position, and set measurable outcomes.
        </p>
      </div>

      <Stepper />
      {step === 0 && <StepDetails />}
      {step === 1 && <StepDesc />}
      {step === 2 && <StepKra />}
      {step === 3 && <StepKpi />}
      {step === 4 && <StepReview />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 24,
          paddingTop: 20,
          borderTop: `1px solid ${T.borderSoft}`,
        }}
      >
        <div>
          {step > 0 && <Btn onClick={() => setStep((s) => s - 1)}>{ico.arrowLeft} Previous</Btn>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={handleCancel}>Cancel</Btn>
          {step < 4 ? (
            <Btn
              primary
              softDisabled={!!continueBlockReason}
              onClick={() => {
                if (continueBlockReason) {
                  toast.error(continueBlockReason);
                  return;
                }
                setStep((s) => s + 1);
              }}
              title={continueBlockReason || undefined}
            >
              Continue <I d="M9 18l6-6-6-6" size={14} stroke="#fff" />
            </Btn>
          ) : (
            <Btn
              primary
              disabled={createJob.isPending}
              softDisabled={!isFormComplete}
              onClick={() => {
                if (saveBlockReason) {
                  toast.error(saveBlockReason);
                  return;
                }
                handleSave();
              }}
              title={saveBlockReason || undefined}
            >
              <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> {createJob.isPending ? "Saving..." : "Save"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
