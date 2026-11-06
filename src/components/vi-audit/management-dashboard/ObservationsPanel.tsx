import { ChartCard } from "./ChartCard";
import type { ChartSpec } from "./data";
import { EMPTY_CHART, type JourneyGroup } from "./viAuditDashboardApi";
import { CategoryJourneyCard } from "./CategoryJourneyCard";

interface ObservationsPanelProps {
  highlighted: boolean;
  loading: boolean;
  obsFunc: ChartSpec | null;
  obsCircle: ChartSpec | null;
  journeyByCircle: JourneyGroup[] | null;
  journeyByFunction: JourneyGroup[] | null;
}

export function ObservationsPanel({ highlighted, loading, obsFunc, obsCircle, journeyByCircle, journeyByFunction }: ObservationsPanelProps) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-obs">
      <div className="acc-hd">
        <div>
          <div className="acc-title">Observations</div>
          <div className="acc-sub">What was observed, where, and how far each observation has progressed</div>
        </div>
      </div>
      <div className="g">
        <ChartCard title="Observations by Function" sub="Observations, CAPA assigned and CAPA closed per function" spec={obsFunc ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !obsFunc} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <ChartCard title="Observations by Circle" sub="Observations, CAPA assigned and CAPA closed per circle" spec={obsCircle ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !obsCircle} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <CategoryJourneyCard
          title="Observations by Classification, Category & Sub Category · By Circle"
          sub="Observations, CAPA plan initiated and CAPA plan closed · pick a circle"
          dimensionLabel="Circle"
          allLabel="All circles"
          groups={journeyByCircle}
          loading={loading}
          showSubCategory
        />
        <CategoryJourneyCard
          title="Observations by Classification & Category · By Function"
          sub="Observations, CAPA plan initiated and CAPA plan closed · pick a function"
          dimensionLabel="Function"
          allLabel="All functions"
          groups={journeyByFunction}
          loading={loading}
        />
      </div>
    </div>
  );
}
