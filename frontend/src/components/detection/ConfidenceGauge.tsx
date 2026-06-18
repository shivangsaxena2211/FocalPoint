import { isAiPrediction } from "../../lib/utils/prediction";

interface ConfidenceGaugeProps {
  confidence: number;
  prediction: string;
  size?: "sm" | "md";
}

export default function ConfidenceGauge({ confidence, prediction, size = "md" }: ConfidenceGaugeProps) {
  const value = Math.min(Math.max(confidence, 0), 100);
  const isAi = isAiPrediction(prediction);
  const radius = size === "sm" ? 52 : 68;
  const stroke = size === "sm" ? 8 : 10;
  const center = radius + stroke;
  const svgSize = (radius + stroke) * 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = isAi ? "#e0627a" : "#d4a853";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize / 2 + stroke }}>
        <svg
          width={svgSize}
          height={svgSize / 2 + stroke}
          viewBox={`0 0 ${svgSize} ${svgSize / 2 + stroke}`}
          className="overflow-visible"
        >
          <path
            d={`M ${stroke} ${center} A ${radius} ${radius} 0 0 1 ${svgSize - stroke} ${center}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${stroke} ${center} A ${radius} ${radius} 0 0 1 ${svgSize - stroke} ${center}`}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 text-center">
          <p
            className={[
              "font-mono font-bold tabular-nums",
              size === "sm" ? "text-xl" : "text-3xl",
              isAi ? "fp-text-threat" : "fp-text-verified",
            ].join(" ")}
          >
            {value.toFixed(1)}%
          </p>
          <p className="fp-label-muted">Confidence</p>
        </div>
      </div>
    </div>
  );
}
