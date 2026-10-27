import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { IncidentDetailView } from "@/components/vi-incident/IncidentDetailView";
import { IncidentActionPlanCards } from "@/components/vi-incident/IncidentActionPlanCards";
import { errorToast, submitViIncident, useViIncidentDetail } from "@/components/vi-incident/viIncidentApi";
import { INCIDENT_REPORTER_PATH } from "./IncidentReporterListPage";

// Reporter: incident detail (read-only), with the investigation and action plans once the SPOC
// has submitted them. Drafts can be edited, or submitted as saved (POST /vi_incidents/:id/submit.json).
const IncidentReporterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incident, loading, reload } = useViIncidentDetail(id);
  const [submitting, setSubmitting] = useState(false);

  const submitDraft = async () => {
    if (!id || submitting) return;
    setSubmitting(true);
    try {
      await submitViIncident(id);
      toast.success("Incident submitted successfully");
      reload();
    } catch (error) {
      // 422 lists what the draft is still missing — edit it to complete those fields.
      errorToast("Failed to submit incident", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IncidentDetailView
      incident={incident}
      loading={loading}
      listPath={INCIDENT_REPORTER_PATH}
      draft={incident?.storedStatus === "draft"}
      footer={
        incident?.canEdit ? (
          <>
            <button
              type="button"
              className="fm-action-secondary w-full sm:w-auto"
              onClick={() => navigate(`${INCIDENT_REPORTER_PATH}/${id}/edit`)}
              disabled={submitting}
            >
              Edit Draft
            </button>
            <button
              type="button"
              className="fm-action-primary w-full sm:w-auto"
              onClick={submitDraft}
              disabled={submitting}
            >
              Submit
            </button>
          </>
        ) : undefined
      }
    >
      {incident && (
        <>
          <IncidentActionPlanCards incident={incident} />
        </>
      )}
    </IncidentDetailView>
  );
};

export default IncidentReporterDetailPage;
