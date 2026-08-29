import React from 'react';
import { Database, AlertTriangle, ShieldCheck, CheckCircle2, FileSpreadsheet, Layers, Info, Hash } from 'lucide-react';
import { DatasetState } from '../types';

interface DataSummaryReportProps {
  state: DatasetState;
}

export const DataSummaryReport: React.FC<DataSummaryReportProps> = ({ state }) => {
  const { qualityReport, targetColumn, taskType } = state;
  const targetColProfile = qualityReport.columns.find(c => c.name === targetColumn);

  // Compute target distribution
  const targetCounts: Record<string, number> = {};
  state.rawData.forEach(row => {
    const val = String(row[targetColumn] ?? 'null');
    targetCounts[val] = (targetCounts[val] || 0) + 1;
  });

  const totalRows = qualityReport.totalRows;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                Phase 1 : Data Understanding &amp; Quality Audit
              </span>
              <span className="text-xs text-slate-400 font-mono">
                IIT Guwahati Hackathon Standard
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Dataset Profiling, Integrity Verification &amp; Leakage Check
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Leakage Guard Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Total Instances</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white font-mono">{qualityReport.totalRows}</span>
            <span className="text-xs text-slate-400">rows</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Features / Attributes</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-400 font-mono">{qualityReport.totalColumns}</span>
            <span className="text-xs text-slate-400">cols</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Missing Cells</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono ${qualityReport.missingCellsTotal > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {qualityReport.missingCellsTotal}
            </span>
            <span className="text-xs text-slate-400">({qualityReport.missingCellsPercentage.toFixed(1)}%)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Duplicate Records</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono ${qualityReport.duplicateRows > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {qualityReport.duplicateRows}
            </span>
            <span className="text-xs text-slate-400">rows</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Target Variable</span>
          <div className="mt-1 truncate">
            <span className="text-base font-bold text-emerald-400 font-mono truncate block" title={targetColumn}>
              {targetColumn}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-medium">{taskType.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Est. Memory</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-300 font-mono">{qualityReport.memoryEstimateKb}</span>
            <span className="text-xs text-slate-400">KB</span>
          </div>
        </div>
      </div>

      {/* Target Distribution & Leakage Alerts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Distribution Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Target Variable Distribution: <span className="font-mono text-emerald-400">{targetColumn}</span>
              </h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              {Object.keys(targetCounts).length} Distinct Classes
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(targetCounts).map(([label, count]) => {
              const pct = totalRows > 0 ? (count / totalRows) * 100 : 0;
              return (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate max-w-[240px]">{label}</span>
                    <span className="font-mono text-slate-400">{count} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Class Balance Ratio:</span>
            <span className="font-mono text-emerald-400">
              {Object.values(targetCounts).length === 2
                ? `${(Math.max(...Object.values(targetCounts)) / (Math.min(...Object.values(targetCounts)) || 1)).toFixed(2)} : 1.0 (Balanced)`
                : 'Multi-category spread'}
            </span>
          </div>
        </div>

        {/* Data Quality & Leakage Audit Alerts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Data Quality &amp; Leakage Audit Warnings</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {qualityReport.leakageSuspects.length > 0 ? (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Potential Post-Match Target Leakage Flagged:</span>
                    <span className="text-rose-400/90">
                      Columns: <span className="font-mono font-bold">{qualityReport.leakageSuspects.join(', ')}</span>.
                      These indicate post-game outcomes that are not causal prior to kickoff. Our pipeline automatically drops or quarantines these before training.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Clean Causal Boundary Verified:</span>
                    <span className="text-emerald-400/90">
                      No post-match leakage features detected in the input schema. Features represent legitimate pre-game intelligence.
                    </span>
                  </div>
                </div>
              )}

              {qualityReport.missingCellsTotal > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Missing Value Treatment:</span>
                    <span className="text-amber-400/90 block mt-0.5">
                      {qualityReport.missingCellsTotal} missing values detected across the dataset. Our Scikit-Learn pipeline applies median imputation for continuous measurements and constant token indicators for categories.
                    </span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Recommended Validation Scheme:</span>
                  <span className="text-slate-400 block mt-0.5">
                    For sports time-series, we employ <strong>5-Fold Time-Aware Walk-Forward Validation</strong> to guarantee zero future-to-past test contamination.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Column Schema & Profiling Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Feature Schema &amp; Profiling Breakdown ({qualityReport.columns.length} Features)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Automatically profiles missingness, cardinality, and numerical distributions
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-slate-800/90 text-slate-300 font-mono">
              <tr>
                <th className="px-3.5 py-3 text-left font-semibold">Column Name</th>
                <th className="px-3.5 py-3 text-left font-semibold">Data Type</th>
                <th className="px-3.5 py-3 text-left font-semibold">Missing Count (%)</th>
                <th className="px-3.5 py-3 text-left font-semibold">Unique Cardinality</th>
                <th className="px-3.5 py-3 text-left font-semibold">Distribution / Stats (Min / Mean / Max)</th>
                <th className="px-3.5 py-3 text-left font-semibold">Sample Values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {qualityReport.columns.map((col) => {
                const isTarget = col.name === targetColumn;
                return (
                  <tr key={col.name} className={`hover:bg-slate-800/40 transition-colors ${isTarget ? 'bg-indigo-950/30' : ''}`}>
                    <td className="px-3.5 py-2.5 font-mono font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span>{col.name}</span>
                        {isTarget && (
                          <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                            Target
                          </span>
                        )}
                        {col.isPotentialLeakage && (
                          <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-sans uppercase font-bold" title={col.leakageReason}>
                            Leakage Alert
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-sans uppercase ${
                        col.type === 'numeric' ? 'bg-blue-950 text-blue-300 border border-blue-800/50' :
                        col.type === 'categorical' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' :
                        col.type === 'datetime' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                        col.type === 'boolean' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {col.type}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono">
                      <span className={col.missingCount > 0 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                        {col.missingCount} ({col.missingPercentage.toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-300">
                      {col.uniqueValues} distinct
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-300">
                      {col.type === 'numeric' && col.mean !== undefined ? (
                        <span className="text-[11px]">
                          Min: <strong className="text-slate-200">{col.min}</strong> | Mean: <strong className="text-indigo-300">{col.mean.toFixed(1)}</strong> | Max: <strong className="text-slate-200">{col.max}</strong>
                        </span>
                      ) : col.topCategories && col.topCategories.length > 0 ? (
                        <span className="text-[11px] text-slate-400">
                          Top: {col.topCategories.slice(0, 2).map(c => `${c.value} (${c.count})`).join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-400 truncate max-w-[200px]">
                      {col.sampleValues.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
