import React from 'react';
import { Layers, ShieldCheck, Cpu, Code2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { DatasetState } from '../types';

interface FeatureEngineeringSectionProps {
  state: DatasetState;
}

export const FeatureEngineeringSection: React.FC<FeatureEngineeringSectionProps> = ({ state }) => {
  const { featureMatrix } = state;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                Phase 3 : Preprocessing &amp; Feature Engineering
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Sports Domain Telemetry to Predictive Signal
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Domain Feature Transformation &amp; Leakage Prevention Architecture
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strictly Causal (Lagged t-1)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Preprocessing Architecture Flow */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          End-to-End Scikit-Learn Pipeline Pipeline Flow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-semibold text-indigo-400 block mb-1">1. Ingestion &amp; Quarantine</span>
            <p className="text-slate-300">
              Quarantine post-match indicators. Parse dates into season cycles and fixture days.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-semibold text-indigo-400 block mb-1">2. Missing Imputation</span>
            <p className="text-slate-300">
              SimpleImputer(strategy='median') on numericals; constant fill token for unknown categories.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-semibold text-indigo-400 block mb-1">3. Categorical Encoders</span>
            <p className="text-slate-300">
              Out-of-Fold (OOF) smoothed TargetEncoder + FrequencyEncoder for teams &amp; venues.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-semibold text-indigo-400 block mb-1">4. Robust Normalization</span>
            <p className="text-slate-300">
              RobustScaler fitted strictly on training folds to eliminate outlier distortion.
            </p>
          </div>
        </div>
      </div>

      {/* Domain Engineered Features Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Domain Engineered Features ({featureMatrix.length} High-Impact Signals)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Engineered exclusively from causal, pre-match sports information
          </span>
        </div>

        <div className="space-y-4">
          {featureMatrix.map((feat) => (
            <div
              key={feat.name}
              className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {feat.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                    {feat.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Relative Signal Weight:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {(feat.importanceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mathematical Formula</span>
                  <code className="text-indigo-300 font-mono font-semibold block">{feat.formula}</code>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Domain Reasoning &amp; Value</span>
                  <p className="text-slate-300 leading-relaxed">{feat.reasoning}</p>
                </div>

                <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-800/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3 h-3" /> Leakage Prevention Guard
                  </span>
                  <p className="text-emerald-300/90 leading-relaxed">{feat.leakageGuard}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
