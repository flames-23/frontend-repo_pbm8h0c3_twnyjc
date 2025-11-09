export default function TrendChart({ data }) {
  if (!data || !data.timeseries || data.timeseries.length === 0) return null;
  const ts = data.timeseries;
  const width = 800;
  const height = 260;
  const padding = 40;
  const years = ts.map((d) => d.year);
  const runsVals = ts.map((d) => d.runs);
  const srVals = ts.map((d) => d.strikerate);
  const xMin = Math.min(...years);
  const xMax = Math.max(...years);
  const yMin = 0;
  const yMax = Math.max(Math.max(...runsVals), Math.max(...srVals)) * 1.1;

  const x = (year) => padding + ((year - xMin) / (xMax - xMin || 1)) * (width - padding * 2);
  const y = (val) => height - padding - ((val - yMin) / (yMax - yMin || 1)) * (height - padding * 2);

  const linePath = (vals) => {
    return vals
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(years[i]).toFixed(2)} ${y(v).toFixed(2)}`)
      .join(' ');
  };

  const runsPath = linePath(runsVals);
  const srPath = linePath(srVals);

  const yTicks = 5;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (i * (yMax - yMin)) / yTicks);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-gray-500 mb-2">Performance Trend</div>
      <div className="w-full overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />

          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={padding} y1={y(t)} x2={width - padding} y2={y(t)} stroke="#f3f4f6" />
              <text x={8} y={y(t) + 4} fontSize={10} fill="#6b7280">{Math.round(t)}</text>
            </g>
          ))}

          {years.map((yr, i) => (
            <text key={i} x={x(yr)} y={height - padding + 16} fontSize={10} textAnchor="middle" fill="#6b7280">{yr}</text>
          ))}

          <path d={runsPath} fill="none" stroke="#2563eb" strokeWidth={2} />
          {runsVals.map((v, i) => (
            <circle key={`r-${i}`} cx={x(years[i])} cy={y(v)} r={3} fill="#2563eb" />
          ))}

          <path d={srPath} fill="none" stroke="#16a34a" strokeWidth={2} />
          {srVals.map((v, i) => (
            <circle key={`s-${i}`} cx={x(years[i])} cy={y(v)} r={3} fill="#16a34a" />
          ))}

          <rect x={width - padding - 180} y={padding} width={170} height={40} rx={8} fill="#f9fafb" stroke="#e5e7eb" />
          <g>
            <circle cx={width - padding - 165} cy={padding + 14} r={5} fill="#2563eb" />
            <text x={width - padding - 150} y={padding + 18} fontSize={12} fill="#374151">Runs</text>
          </g>
          <g>
            <circle cx={width - padding - 165} cy={padding + 30} r={5} fill="#16a34a" />
            <text x={width - padding - 150} y={padding + 34} fontSize={12} fill="#374151">Strike Rate</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
