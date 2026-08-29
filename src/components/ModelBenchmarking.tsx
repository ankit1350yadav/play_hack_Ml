import React, { useState } from 'react';
import { Cpu, Trophy, CheckCircle2, TrendingUp, BarChart2, Zap, Clock, ShieldAlert, Award } from 'lucide-react';
import { DatasetState } from '../types';

interface ModelBenchmarkingProps {
  state: DatasetState;
}

export const ModelBenchmarking: React.FC<ModelBenchmarkingProps> = ({ state }) => {
  const { models, taskType } = state;
  const bestModel = models.find(m => m.isBest) || models[0];
  const [selectedModelName, setSelectedModelName] = useState<string>(bestModel.name);

  const activeModel = models.find(m => m.name === selectedModelName) || bestModel;
  const isRegression = taskType === 'regression';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                Phase 4 : Model Benchmark &amp; Cross-Validation Matrix
              </span>
              <span className="text-xs text-slate-400 font-mono">
                5-Fold Stratified / Walk-Forward Split
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Multi-Model Evaluation, Calibration &amp; Leaderboard Comparison
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Best Model: {bestModel.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Model Comparison Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Model Comparison Matrix</h3>
          </div>
          <span className="text-xs text-slate-400">
            Evaluated on identical cross-validation folds with fixed seed (random_state=42)
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-slate-800/90 text-slate-300 font-mono">
              <tr>
                <th className="px-3.5 py-3 text-left font-semibold">Model Candidate</th>
                <th className="px-3.5 py-3 text-left font-semibold">Family</th>
                {isRegression ? (
                  <>
                    <th className="px-3.5 py-3 text-left font-semibold">RMSE ↓</th>
                    <th className="px-3.5 py-3 text-left font-semibold">MAE ↓</th>
                    <th className="px-3.5 py-3 text-left font-semibold">R² Score ↑</th>
                    <th className="px-3.5 py-3 text-left font-semibold">5-Fold CV (RMSE)</th>
                  </>
                ) : (
                  <>
                    <th className="px-3.5 py-3 text-left font-semibold">ROC-AUC ↑</th>
                    <th className="px-3.5 py-3 text-left font-semibold">F1-Macro ↑</th>
                    <th className="px-3.5 py-3 text-left font-semibold">Accuracy ↑</th>
                    <th className="px-3.5 py-3 text-left font-semibold">Log-Loss ↓</th>
                    <th className="px-3.5 py-3 text-left font-semibold">5-Fold CV (AUC ± σ)</th>
                  </>
                )}
                <th className="px-3.5 py-3 text-left font-semibold">Train Time</th>
                <th className="px-3.5 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {models.map((model) => {
                const isSelected = selectedModelName === model.name;
                return (
                  <tr
                    key={model.name}
                    onClick={() => setSelectedModelName(model.name)}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <td className="px-3.5 py-3 font-semibold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.isBest && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-sans uppercase font-bold flex items-center gap-1">
                            <Trophy className="w-2.5 h-2.5" /> Best
                          </span>
                        )}
                        {model.isBaseline && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                            Baseline
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-slate-400 font-sans">
                      {model.modelType}
                    </td>

                    {isRegression ? (
                      <>
                        <td className="px-3.5 py-3 font-mono font-bold text-indigo-300">
                          {model.metrics.rmse?.toFixed(2)}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-300">
                          {model.metrics.mae?.toFixed(2)}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-emerald-400">
                          {model.metrics.r2Score?.toFixed(3)}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-300">
                          {model.metrics.cvMean.toFixed(2)} ± {model.metrics.cvStd.toFixed(2)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3.5 py-3 font-mono font-bold text-emerald-400">
                          {model.metrics.rocAuc?.toFixed(3)}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-indigo-300">
                          {model.metrics.f1Score?.toFixed(3)}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-300">
                          {model.metrics.accuracy ? (model.metrics.accuracy * 100).toFixed(1) + '%' : '—'}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-400">
                          {model.metrics.logLoss?.toFixed(3)}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-300">
                          {model.metrics.cvMean.toFixed(3)} ± {model.metrics.cvStd.toFixed(3)}
                        </td>
                      </>
                    )}

                    <td className="px-3.5 py-3 font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{model.trainTimeMs}ms</span>
                    </td>
                    <td className="px-3.5 py-3">
                      {model.isBest ? (
                        <span className="text-[10px] text-emerald-300 bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium">
                          Selected for Production
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          Benchmarked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400">Selected Model Diagnostics</span>
            <h3 className="text-base font-bold text-white mt-0.5">{activeModel.name}</h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
            CV Mean: {activeModel.metrics.cvMean.toFixed(3)} (±{activeModel.metrics.cvStd.toFixed(3)})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Competitive Advantages &amp; Strengths
            </span>
            <p className="text-slate-300 leading-relaxed">{activeModel.advantages}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Potential Trade-offs &amp; Limitations
            </span>
            <p className="text-slate-300 leading-relaxed">{activeModel.disadvantages}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
