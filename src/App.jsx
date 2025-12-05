import React, { useState } from "react";
import "./App.css";

export default function HydrationDeviationAlert() {
  const [inputs, setInputs] = useState({
    weight: "",
    avgIntake: "",
    activityLevel: "low",
    climate: "mild",
    thirstLevel: "normal",
  });

  const [result, setResult] = useState(null);

  const inputBase =
    "w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  const handleInput = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const calculateDeviation = () => {
    const weight = Number(inputs.weight);
    const avgIntake = Number(inputs.avgIntake);

    if (!weight || weight < 30) return alert("Please enter a valid weight (30+ kg).");
    if (!avgIntake || avgIntake < 200) return alert("Enter your daily water intake (min 200 ml).");

    // Ideal hydration baseline: 30–35 ml/kg
    let idealLow = weight * 30;
    let idealHigh = weight * 35;

    // Adjustments
    if (inputs.activityLevel === "moderate") {
      idealLow += 200;
      idealHigh += 300;
    } else if (inputs.activityLevel === "high") {
      idealLow += 500;
      idealHigh += 700;
    }

    if (inputs.climate === "hot") {
      idealLow += 300;
      idealHigh += 400;
    } else if (inputs.climate === "veryHot") {
      idealLow += 600;
      idealHigh += 700;
    }

    // Determine deviation
    let deviation = "";
    let level = "";

    if (avgIntake < idealLow * 0.7) {
      deviation = "Severely Under-Hydrated";
      level = "veryLow";
    } else if (avgIntake < idealLow) {
      deviation = "Under-Hydrated";
      level = "low";
    } else if (avgIntake > idealHigh * 1.4) {
      deviation = "Severely Over-Hydrated";
      level = "veryHigh";
    } else if (avgIntake > idealHigh) {
      deviation = "Over-Hydrated";
      level = "high";
    } else {
      deviation = "In a Healthy Range";
      level = "normal";
    }

    const summary = buildSummary(inputs, idealLow, idealHigh);
    const tips = buildTips(inputs, level);

    setResult({
      deviation,
      level,
      idealLow,
      idealHigh,
      summary,
      tips,
      actual: avgIntake,
    });
  };

  const buildSummary = (i, low, high) => {
    const parts = [];

    parts.push(`Your calculated optimal hydration range is ${low}–${high} ml/day.`);

    if (i.thirstLevel === "high")
      parts.push("You frequently feel thirsty, suggesting hydration gaps.");

    if (i.thirstLevel === "low")
      parts.push("You rarely feel thirsty — may be drinking too much or just well hydrated.");

    if (i.activityLevel === "high")
      parts.push("High activity increases sweat-related losses significantly.");

    if (i.climate !== "mild")
      parts.push("Your climate increases daily water needs.");

    return parts.join(" ");
  };

  const buildTips = (i, level) => {
    const tips = [];

    if (level === "low" || level === "veryLow") {
      tips.push("Increase water intake earlier in the day.");
      tips.push("Carry a bottle to avoid accidental under-hydration.");
      if (i.activityLevel !== "low")
        tips.push("Add electrolytes during high activity or hot climate.");
    }

    if (level === "high" || level === "veryHigh") {
      tips.push("Avoid forcing water if you're not thirsty.");
      tips.push("Spread hydration instead of large gulps.");
      tips.push("Monitor electrolytes if drinking very high volumes.");
    }

    tips.push("Use thirst, urine color, and energy levels as real-time indicators.");

    return tips;
  };

  const badgeClass = (level) => {
    return {
      normal: "bg-emerald-100 text-emerald-700",
      low: "bg-yellow-100 text-yellow-700",
      veryLow: "bg-red-100 text-red-700",
      high: "bg-blue-100 text-blue-700",
      veryHigh: "bg-purple-100 text-purple-700",
    }[level];
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-center mb-2">
          Hydration Deviation Alert
        </h2>
        <p className="text-gray-500 text-xs text-center mb-5">
          Detect over- or under-hydration based on your habits & environment.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Body Weight (kg)</label>
            <input
              type="number"
              className={inputBase}
              placeholder="e.g. 70"
              value={inputs.weight}
              onChange={(e) => handleInput("weight", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Daily Water Intake (ml)</label>
            <input
              type="number"
              className={inputBase}
              placeholder="e.g. 2000"
              value={inputs.avgIntake}
              onChange={(e) => handleInput("avgIntake", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Activity Level</label>
            <select
              className={inputBase}
              value={inputs.activityLevel}
              onChange={(e) => handleInput("activityLevel", e.target.value)}
            >
              <option value="low">Low (mostly sedentary)</option>
              <option value="moderate">Moderate (light workouts)</option>
              <option value="high">High (intense training)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Climate</label>
            <select
              className={inputBase}
              value={inputs.climate}
              onChange={(e) => handleInput("climate", e.target.value)}
            >
              <option value="mild">Mild / Indoor</option>
              <option value="hot">Hot</option>
              <option value="veryHot">Very Hot</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Thirst Level</label>
            <select
              className={inputBase}
              value={inputs.thirstLevel}
              onChange={(e) => handleInput("thirstLevel", e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="low">Rarely Thirsty</option>
              <option value="high">Very Thirsty</option>
            </select>
          </div>

          <button
            onClick={calculateDeviation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition"
          >
            Check Hydration Status
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Hydration Analysis</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass(
                  result.level
                )}`}
              >
                {result.deviation}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2">
              Optimal Range: {result.idealLow}–{result.idealHigh} ml/day
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Your intake: {result.actual} ml/day
            </p>

            <h4 className="text-sm font-semibold mb-1">Key Patterns</h4>
            <p className="text-sm text-gray-700 mb-3">{result.summary}</p>

            <h4 className="text-sm font-semibold mb-1">Actionable Tips</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {result.tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>

            <p className="text-[11px] text-gray-400 mt-3">
              Over- or under-hydration may be influenced by diet, climate,
              exercise, or medications. Consult a professional for persistent
              symptoms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
