import { CheckSquare, Paperclip, ShieldCheck } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import type { ViIncidentActionPlan } from "./viIncidentData";

const Attachments = ({ names }: { names: string[] }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-xs text-[rgba(26,26,24,0.48)]">
      <span className="font-semibold text-[#1A1A18]">Attachments</span>
      <span>{names.length} photos</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {names.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs text-[#1A1A18]"
        >
          <Paperclip className="w-3 h-3" />
          {name}
        </span>
      ))}
    </div>
  </div>
);

/**
 * Read-only action plan cards for an incident: per root cause, the checklist item and corrective
 * action plan, followed by the corrective / preventive action taken once the action owner submitted it.
 * Shared by the Action Owner and Functional Head detail pages.
 */
export const IncidentActionPlanCards = ({ plans }: { plans: ViIncidentActionPlan[] }) => (
  <>
    {plans.map((plan, index) => (
        <div key={plan.id} className="mb-5 space-y-5">
          <DetailCard
            icon={sectionIcon(CheckSquare)}
            title={plans.length > 1 ? `Checklist Item ${index + 1}` : "Checklist Item"}
          >
            <p className="mb-3 text-xs text-[rgba(26,26,24,0.48)]">{plan.checklistPath}</p>
            <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">{`CL0${index + 1}`}</div>
            <p className="text-sm text-[#1A1A18] line-clamp-2">{plan.cause}</p>
          </DetailCard>

          <DetailCard icon={sectionIcon(ShieldCheck)} title="Corrective Action Plan">
            <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">{plan.id}</div>
            <p className="mb-4 border-b border-[rgba(26,26,24,0.09)] pb-4 text-sm text-[#1A1A18] whitespace-pre-wrap">
              {plan.corrective}
            </p>
            <FieldGrid
              columns={2}
              fields={[
                { label: "Action Owner", value: plan.actionOwner },
                { label: "Target Date", value: plan.targetDate },
              ]}
            />
          </DetailCard>

          {plan.taken && (
            <>
              <DetailCard icon={sectionIcon(ShieldCheck)} title="Corrective Action Taken">
                <p className="mb-4 border-b border-[rgba(26,26,24,0.09)] pb-4 text-sm text-[#1A1A18] whitespace-pre-wrap">
                  {plan.taken.corrective}
                </p>
                <div className="mb-4">
                  <FieldGrid columns={2} fields={[{ label: "Closure Date", value: plan.taken.closureDate }]} />
                </div>
                <Attachments names={plan.taken.attachments} />
              </DetailCard>
              <DetailCard icon={sectionIcon(ShieldCheck)} title="Preventive Action Taken">
                <p className="mb-4 border-b border-[rgba(26,26,24,0.09)] pb-4 text-sm text-[#1A1A18] whitespace-pre-wrap">
                  {plan.taken.preventive}
                </p>
                <div className="mb-4">
                  <FieldGrid columns={2} fields={[{ label: "Closure Date", value: plan.taken.closureDate }]} />
                </div>
                <Attachments names={plan.taken.attachments} />
              </DetailCard>
            </>
          )}
        </div>
      ))}
  </>
);
