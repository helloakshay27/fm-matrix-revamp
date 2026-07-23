import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { fetchPulseAiGreeting, type PulseAiGreetingResponse, type PartOfDay } from "@/services/pulseAiGreetingApi";

const DEFAULT_META = { icon: Sun, color: "#DA7756" };

const PART_OF_DAY_META: Record<PartOfDay, { icon: typeof Sun; color: string }> = {
  morning: { icon: Sunrise, color: "#EDC488" },
  afternoon: { icon: Sun, color: "#DA7756" },
  evening: { icon: Sunset, color: "#E7848E" },
  night: { icon: Moon, color: "#6B9BCC" },
};

export function PulseGreeting() {
  const [data, setData] = useState<PulseAiGreetingResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPulseAiGreeting()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((e) => console.error(e));
    return () => { cancelled = true; };
  }, []);

  if (!data) return null;

  const meta = PART_OF_DAY_META[data.part_of_day] ?? DEFAULT_META;
  const Icon = meta.icon;

  return (
    <div className="ps-greeting">
      <div className="ps-greeting-icon" style={{ color: meta.color, background: `${meta.color}22` }}>
        <Icon size={18} />
      </div>
      <div className="ps-greeting-copy">
        <div className="ps-greeting-text">
          {data.greeting}, <span className="ps-greeting-name">{data.user_name}</span>
        </div>
        <div className="ps-greeting-quote">{data.quote}</div>
      </div>
    </div>
  );
}
