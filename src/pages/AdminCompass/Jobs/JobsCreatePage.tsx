// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { useJobs } from "./JobsContext";
import { T } from "./constants";
import { I, ico } from "./icons";
import { Btn } from "./components/UI";
import Stepper from "./components/Stepper";
import { StepDetails, StepDesc, StepKra, StepKpi, StepReview } from "./components/JobFormSteps";

export default function JobsCreatePage() {
  const navigate = useNavigate();
  const { step, setStep, canNext, saveJd, resetCreate } = useJobs();

  const handleCancel = () => {
    resetCreate();
    navigate("/admin-compass/jobs");
  };

  const handleSave = () => {
    saveJd();
    navigate("/admin-compass/jobs");
  };

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
            <Btn primary disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
              Continue <I d="M9 18l6-6-6-6" size={14} stroke="#fff" />
            </Btn>
          ) : (
            <Btn primary onClick={handleSave}>
              <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> Save
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
