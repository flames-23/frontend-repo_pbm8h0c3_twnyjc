export default function AIReasoning({ data }) {
  if (!data) return null;
  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-blue-600 font-semibold">AI Prediction</div>
      <div className="mt-2 text-gray-800 leading-relaxed">{data.ai_reasoning}</div>
    </div>
  );
}
