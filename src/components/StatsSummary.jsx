export default function StatsSummary({ data }) {
  if (!data) return null;
  const { player, avg_runs, strike_rate, avg_wickets, summary, trend, predicted_future_performance } = data;
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1 md:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-gray-500">Player</div>
        <div className="text-2xl font-semibold text-gray-800">{player}</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500">Avg Runs</div>
            <div className="text-lg font-medium">{avg_runs}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Strike Rate</div>
            <div className="text-lg font-medium">{strike_rate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Wickets</div>
            <div className="text-lg font-medium">{avg_wickets}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Trend</div>
            <div className="text-lg font-medium">{trend}</div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-xs text-gray-500">Total Matches</div>
        <div className="text-2xl font-semibold">{summary?.total_matches}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-xs text-gray-500">Total Runs</div>
        <div className="text-2xl font-semibold">{summary?.total_runs}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-xs text-gray-500">50s / 100s</div>
        <div className="text-2xl font-semibold">{summary?.fifties} / {summary?.hundreds}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-500">Prediction</div>
          <div className="text-xl font-semibold">{predicted_future_performance}</div>
        </div>
      </div>
    </div>
  );
}
