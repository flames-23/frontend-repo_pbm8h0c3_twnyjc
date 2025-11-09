import { useState } from "react";
import PlayerSearch from "./components/PlayerSearch";
import StatsSummary from "./components/StatsSummary";
import AIReasoning from "./components/AIReasoning";
import TrendChart from "./components/TrendChart";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Fallback local dataset for demo mode when backend is unreachable
const DEMO_DATA = [
  { player: "Virat Kohli", year: 2019, matches: 26, innings: 24, runs: 1377, average: 59.87, strikerate: 96.3, "50s": 7, "100s": 5, wickets: 0 },
  { player: "Virat Kohli", year: 2020, matches: 9, innings: 9, runs: 431, average: 47.89, strikerate: 92.2, "50s": 3, "100s": 0, wickets: 0 },
  { player: "Virat Kohli", year: 2021, matches: 15, innings: 14, runs: 560, average: 46.67, strikerate: 88.4, "50s": 5, "100s": 0, wickets: 0 },
  { player: "Virat Kohli", year: 2022, matches: 24, innings: 22, runs: 1180, average: 56.19, strikerate: 98.7, "50s": 8, "100s": 3, wickets: 0 },
  { player: "Virat Kohli", year: 2023, matches: 27, innings: 25, runs: 1377, average: 64.0, strikerate: 99.1, "50s": 10, "100s": 6, wickets: 0 },
  { player: "Rohit Sharma", year: 2019, matches: 28, innings: 27, runs: 1490, average: 57.3, strikerate: 89.4, "50s": 7, "100s": 7, wickets: 0 },
  { player: "Rohit Sharma", year: 2020, matches: 6, innings: 6, runs: 290, average: 48.33, strikerate: 90.1, "50s": 2, "100s": 0, wickets: 0 },
  { player: "Rohit Sharma", year: 2021, matches: 12, innings: 12, runs: 466, average: 42.36, strikerate: 85.7, "50s": 3, "100s": 0, wickets: 0 },
  { player: "Rohit Sharma", year: 2022, matches: 20, innings: 19, runs: 701, average: 43.81, strikerate: 91.2, "50s": 6, "100s": 1, wickets: 0 },
  { player: "Rohit Sharma", year: 2023, matches: 25, innings: 24, runs: 1250, average: 52.08, strikerate: 97.5, "50s": 9, "100s": 4, wickets: 0 },
  { player: "Jasprit Bumrah", year: 2019, matches: 18, innings: 18, runs: 45, average: 7.5, strikerate: 60.0, "50s": 0, "100s": 0, wickets: 32 },
  { player: "Jasprit Bumrah", year: 2020, matches: 8, innings: 8, runs: 20, average: 6.0, strikerate: 55.0, "50s": 0, "100s": 0, wickets: 14 },
  { player: "Jasprit Bumrah", year: 2021, matches: 10, innings: 10, runs: 25, average: 8.3, strikerate: 58.0, "50s": 0, "100s": 0, wickets: 20 },
  { player: "Jasprit Bumrah", year: 2022, matches: 16, innings: 16, runs: 40, average: 8.0, strikerate: 62.0, "50s": 0, "100s": 0, wickets: 28 },
  { player: "Jasprit Bumrah", year: 2023, matches: 22, innings: 22, runs: 60, average: 9.0, strikerate: 65.0, "50s": 0, "100s": 0, wickets: 35 },
  { player: "Babar Azam", year: 2019, matches: 20, innings: 19, runs: 1092, average: 60.7, strikerate: 88.1, "50s": 6, "100s": 3, wickets: 0 },
  { player: "Babar Azam", year: 2020, matches: 7, innings: 7, runs: 416, average: 59.4, strikerate: 90.5, "50s": 4, "100s": 1, wickets: 0 },
  { player: "Babar Azam", year: 2021, matches: 16, innings: 16, runs: 945, average: 59.1, strikerate: 92.7, "50s": 7, "100s": 3, wickets: 0 },
  { player: "Babar Azam", year: 2022, matches: 22, innings: 22, runs: 1184, average: 62.3, strikerate: 94.3, "50s": 9, "100s": 4, wickets: 0 },
  { player: "Babar Azam", year: 2023, matches: 24, innings: 24, runs: 1325, average: 58.0, strikerate: 96.2, "50s": 10, "100s": 5, wickets: 0 },
];

function summarizeLocal(name) {
  const rows = DEMO_DATA.filter((r) => r.player.toLowerCase() === name.toLowerCase()).sort((a, b) => a.year - b.year);
  if (rows.length === 0) return null;

  const avg = (arr) => arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
  const avg_runs = Number(avg(rows.map((r) => r.average))).toFixed(2);
  const strike_rate = Number(avg(rows.map((r) => r.strikerate))).toFixed(2);
  const avg_wickets = Number(avg(rows.map((r) => r.wickets))).toFixed(2);

  const last3 = rows.slice(-3);
  const dir = (vals) => {
    const diffs = vals.slice(1).map((v, i) => v - vals[i]);
    const score = diffs.filter((d) => d > 0).length - diffs.filter((d) => d < 0).length;
    return score > 0 ? 1 : score < 0 ? -1 : 0;
  };
  const dr = dir(last3.map((r) => r.runs));
  const ds = dir(last3.map((r) => r.strikerate));
  const trend_runs = dr === 1 ? "Improving" : dr === -1 ? "Declining" : "Stable";
  const trend_sr = ds === 1 ? "Improving" : ds === -1 ? "Declining" : "Stable";
  const trend = dr + ds > 0 ? "Improving" : dr + ds < 0 ? "Declining" : "Stable";

  const meanRuns = avg(rows.map((r) => r.runs));
  const stdRuns = Math.sqrt(avg(rows.map((r) => (r.runs - meanRuns) ** 2)));
  const cv = stdRuns / (meanRuns + 1e-6);
  const consistency = cv < 0.25 ? "High" : cv < 0.5 ? "Medium" : "Low";

  const recent_avg_runs = avg(last3.map((r) => r.average));
  const recent_sr = avg(last3.map((r) => r.strikerate));

  let score = 0;
  score += trend === "Improving" ? 2 : trend === "Stable" ? 1 : 0;
  score += recent_avg_runs >= avg(rows.map((r) => r.average)) * 1.05 ? 2 : recent_avg_runs >= avg(rows.map((r) => r.average)) * 0.95 ? 1 : 0;
  score += recent_sr >= avg(rows.map((r) => r.strikerate)) * 1.05 ? 2 : recent_sr >= avg(rows.map((r) => r.strikerate)) * 0.95 ? 1 : 0;
  score += consistency === "High" ? 2 : consistency === "Medium" ? 1 : 0;

  const predicted = score >= 7 ? "Excellent" : score >= 5 ? "Good" : score >= 3 ? "Average" : "Poor";

  const ai_reasoning = `Trend in runs is ${trend_runs} and strike rate is ${trend_sr}. Recent averages compare ${recent_avg_runs >= avg(rows.map((r) => r.average)) ? 'favorably' : 'less favorably'} to career stats. Consistency is ${consistency}. Overall, near-term performance is expected to be ${predicted.toLowerCase()}.`;

  return {
    player: rows[0].player,
    avg_runs: Number(avg_runs),
    strike_rate: Number(strike_rate),
    avg_wickets: Number(avg_wickets),
    trend,
    predicted_future_performance: predicted,
    ai_reasoning,
    consistency,
    recent: { avg_runs: Number(recent_avg_runs.toFixed(2)), strike_rate: Number(recent_sr.toFixed(2)) },
    timeseries: rows.map((r) => ({ year: r.year, runs: r.runs, strikerate: r.strikerate, average: r.average })),
    summary: {
      total_matches: rows.reduce((s, r) => s + r.matches, 0),
      total_runs: rows.reduce((s, r) => s + r.runs, 0),
      hundreds: rows.reduce((s, r) => s + r["100s"], 0),
      fifties: rows.reduce((s, r) => s + r["50s"], 0),
    },
  };
}

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  const handleGenerate = async (name) => {
    setError("");
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch(`${BACKEND}/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: name }),
      });
      if (!res.ok) throw new Error("backend unavailable");
      const data = await res.json();
      setReport(data);
    } catch (e) {
      // Fallback to local reasoning if backend fails
      const local = summarizeLocal(name);
      if (local) {
        setReport(local);
        setError("");
      } else {
        setError("No data found for this player and backend is unavailable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Cricket Player Performance Predictor</h1>
          <p className="mt-2 text-gray-600">Enter a player's name to analyze historical stats and get an AI-powered outlook.</p>
        </header>

        <PlayerSearch onGenerate={handleGenerate} />

        {loading && (
          <div className="mt-8 text-center text-gray-600">Generating report...</div>
        )}
        {error && (
          <div className="mt-8 text-center text-red-600 font-medium">{error}</div>
        )}

        {report && (
          <div className="mt-10 space-y-6">
            <StatsSummary data={report} />
            <AIReasoning data={report} />
            <TrendChart data={report} />
          </div>
        )}

        {!loading && !report && !error && (
          <div className="mt-12 text-center text-sm text-gray-500">
            Try names like <span className="font-semibold text-gray-700">Virat Kohli</span>, <span className="font-semibold text-gray-700">Rohit Sharma</span>, <span className="font-semibold text-gray-700">Jasprit Bumrah</span>, <span className="font-semibold text-gray-700">Babar Azam</span>.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
