// @ts-nocheck
import { useJobs } from "../JobsContext";
import { STEPS } from "../constants";
import { T } from "../constants";
import { I } from "../icons";

export default function Stepper() {
  const { step, setStep } = useJobs();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 28,
      }}
    >
      {STEPS.map((st, i) => {
        const done = i < step,
          active = i === step;
        return (
          <div
            key={st.key}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < STEPS.length - 1 ? 1 : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: done ? "pointer" : "default",
                whiteSpace: "nowrap",
              }}
              onClick={() => done && setStep(i)}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  background: done ? T.growth : active ? T.orange : T.surface,
                  color: done || active ? "#fff" : T.inkMuted,
                  border:
                    done || active ? "none" : `1.5px solid ${T.borderWarm}`,
                }}
              >
                {done ? (
                  <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" />
                ) : (
                  st.num
                )}
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 600,
                  color: active ? T.ink : done ? T.growth : T.inkMuted,
                }}
              >
                {st.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 12px",
                  borderRadius: 1,
                  background: done ? T.growth : T.borderSoft,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
