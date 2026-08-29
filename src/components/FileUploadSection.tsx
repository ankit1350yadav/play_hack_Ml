import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Eye,
  Sparkles,
  Filter,
  Sliders,
  ShieldCheck,
  Zap,
  Layers,
  Code2,
  Trash2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { DatasetState, TaskType, OptimizationMetric, ValidationStrategy, ImputationStrategy, ScalerType, CategoricalEncoding } from '../types';

interface FileUploadSectionProps {
  state: DatasetState;
  onFileUpload: (csvContent: string, fileName: string) => void;
  onUpdateDirectives: (directives: Partial<DatasetState['directives']>) => void;
  onTargetChange: (newTarget: string) => void;
  onTaskTypeChange: (newTaskType: TaskType) => void;
  onToggleColumnExclusion: (columnName: string) => void;
  onRunPipeline: () => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  state,
  onFileUpload,
  onUpdateDirectives,
  onTargetChange,
  onTaskTypeChange,
  onToggleColumnExclusion,
  onRunPipeline
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'paste'>('file');
  const [pastedCsv, setPastedCsv] = useState<string>('');
  const [customFileName, setCustomFileName] = useState<string>('custom_dataset.csv');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onFileUpload(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!pastedCsv.trim()) return;
    const fileName = customFileName.endsWith('.csv') ? customFileName : `${customFileName}.csv`;
    onFileUpload(pastedCsv, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: User Ingestion Center */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5" /> Phase 1 : Ingestion &amp; Directives
              </span>
              <span className="text-xs text-slate-400 font-mono">User-Driven ML Engine</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Dataset Ingestion &amp; Problem Directives Studio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your dataset and specify your exact problem instructions, target variable, metrics, and constraints.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setUploadMode('file')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                uploadMode === 'file'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload CSV File</span>
            </button>
            <button
              onClick={() => setUploadMode('paste')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                uploadMode === 'paste'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Raw CSV Text</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone & Instructions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload Dropzone or Paste Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {uploadMode === 'file' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[280px] ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10'
                  : 'border-slate-700 hover:border-indigo-500/70 bg-slate-900/60 hover:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-900/40 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">
                Upload Your Dataset File
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-4">
                Drag and drop your <code className="text-indigo-300 font-mono">.csv</code> or <code className="text-indigo-300 font-mono">.tsv</code> file here, or click to browse.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Any CSV Schema</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Auto Delimiter</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Client-Side Parse</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Paste Raw CSV / Tabular Text
                </label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="dataset_name.csv"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono w-40"
                />
              </div>

              <textarea
                value={pastedCsv}
                onChange={(e) => setPastedCsv(e.target.value)}
                placeholder="feature_1,feature_2,feature_3,target&#10;12.5,45.2,Category_A,1&#10;10.1,38.9,Category_B,0&#10;..."
                rows={9}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />

              <button
                onClick={handlePasteSubmit}
                disabled={!pastedCsv.trim()}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Parse &amp; Ingest Pasted Data</span>
              </button>
            </div>
          )}

          {/* Current Ingested Dataset Badge */}
          {state.rawData.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">{state.fileName}</span>
                  <span className="text-slate-400">
                    {state.qualityReport.totalRows} rows • {state.qualityReport.totalColumns} columns parsed
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-mono uppercase font-bold">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Right: User Instructions & Problem Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                User Problem Specification &amp; ML Directives
              </h3>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full font-mono">
                Full User Control
              </span>
            </div>

            {/* Problem Name & Domain Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Problem / Project Name
                </label>
                <input
                  type="text"
                  value={state.directives.problemName}
                  onChange={(e) => onUpdateDirectives({ problemName: e.target.value })}
                  placeholder="e.g. Churn Predictor / Match Outcome"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Domain / Category
                </label>
                <select
                  value={state.directives.problemDomain}
                  onChange={(e) => onUpdateDirectives({ problemDomain: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="Sports Analytics & Match Prediction">Sports Analytics &amp; Match Prediction</option>
                  <option value="Customer Churn & Retention">Customer Churn &amp; Retention</option>
                  <option value="Financial Risk & Fraud Detection">Financial Risk &amp; Fraud Detection</option>
                  <option value="Healthcare & Diagnostics">Healthcare &amp; Diagnostics</option>
                  <option value="E-Commerce & Sales Forecasting">E-Commerce &amp; Sales Forecasting</option>
                  <option value="General Tabular Machine Learning">General Tabular Machine Learning</option>
                </select>
              </div>
            </div>

            {/* Custom User Instructions Prompt Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>User Custom Instructions &amp; Constraints</span>
                <span className="text-[10px] text-indigo-400 font-normal">Directs feature engineering, modeling &amp; report</span>
              </label>
              <textarea
                value={state.directives.userInstructions}
                onChange={(e) => onUpdateDirectives({ userInstructions: e.target.value })}
                placeholder="Provide any specific goals or instructions (e.g. 'Focus on high recall for positive class', 'Handle heavy class imbalance with class weights', 'Strictly avoid target leakage from post-match fields', 'Prioritize low-latency LightGBM tree models')..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            {/* Target Column & Task Type Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Variable (Prediction Label)
                </label>
                <select
                  value={state.targetColumn}
                  onChange={(e) => onTargetChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {state.headers.map(h => (
                    <option key={h} value={h}>
                      {h} {h === state.targetColumn ? '(Target)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prediction Task Type
                </label>
                <select
                  value={state.taskType}
                  onChange={(e) => onTaskTypeChange(e.target.value as TaskType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="binary_classification">Binary Classification (0 / 1 or Win / Loss)</option>
                  <option value="multiclass_classification">Multiclass Classification (3+ Classes)</option>
                  <option value="regression">Regression (Continuous Numerical Target)</option>
                </select>
              </div>
            </div>

            {/* Metric & Validation Strategy Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Optimization Metric
                </label>
                <select
                  value={state.directives.optimizationMetric}
                  onChange={(e) => onUpdateDirectives({ optimizationMetric: e.target.value as OptimizationMetric })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="roc_auc">ROC-AUC (Area Under Curve)</option>
                  <option value="f1_macro">F1-Macro Score</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="log_loss">Log-Loss (Cross-Entropy)</option>
                  <option value="precision">Precision</option>
                  <option value="recall">Recall</option>
                  <option value="rmse">RMSE (Root Mean Squared Error)</option>
                  <option value="mae">MAE (Mean Absolute Error)</option>
                  <option value="r2">R² Score</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Validation Scheme
                </label>
                <select
                  value={state.directives.validationStrategy}
                  onChange={(e) => onUpdateDirectives({ validationStrategy: e.target.value as ValidationStrategy })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="stratified_5fold">5-Fold Stratified Cross-Validation</option>
                  <option value="kfold_5">5-Fold Standard Cross-Validation</option>
                  <option value="kfold_10">10-Fold Cross-Validation</option>
                  <option value="timeseries_split">Time-Series Walk-Forward Split</option>
                  <option value="train_test_80_20">80/20 Train-Test Holdout Split</option>
                </select>
              </div>
            </div>

            {/* Preprocessing Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Imputation Strategy
                </label>
                <select
                  value={state.directives.imputationStrategy}
                  onChange={(e) => onUpdateDirectives({ imputationStrategy: e.target.value as ImputationStrategy })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="median">Median Imputation</option>
                  <option value="mean">Mean Imputation</option>
                  <option value="mode">Mode / Most Frequent</option>
                  <option value="constant">Constant Value Fill</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Feature Scaler
                </label>
                <select
                  value={state.directives.scalerType}
                  onChange={(e) => onUpdateDirectives({ scalerType: e.target.value as ScalerType })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="robust">RobustScaler (Outlier-safe)</option>
                  <option value="standard">StandardScaler (Z-Score)</option>
                  <option value="minmax">MinMaxScaler [0, 1]</option>
                  <option value="none">None (Tree native)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Categorical Encoder
                </label>
                <select
                  value={state.directives.categoricalEncoding}
                  onChange={(e) => onUpdateDirectives({ categoricalEncoding: e.target.value as CategoricalEncoding })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="ordinal">Ordinal Encoding</option>
                  <option value="target_oof">Target Encoding (OOF)</option>
                  <option value="onehot">One-Hot Encoding</option>
                  <option value="frequency">Frequency Encoding</option>
                </select>
              </div>
            </div>
          </div>

          {/* Run Pipeline Action Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onRunPipeline}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Apply Instructions &amp; Execute ML Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Selection & Column Leakage Quarantine Toggle */}
      {state.headers.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Feature Selection &amp; Leakage Quarantine Toggle
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle features to include in training or quarantine post-event/ID columns according to your instructions.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {state.headers.length - state.directives.excludedColumns.length} of {state.headers.length} Active Features
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {state.headers.map(col => {
              const isTarget = col === state.targetColumn;
              const isExcluded = state.directives.excludedColumns.includes(col);
              const colProfile = state.qualityReport.columns.find(c => c.name === col);

              return (
                <button
                  key={col}
                  onClick={() => !isTarget && onToggleColumnExclusion(col)}
                  disabled={isTarget}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    isTarget
                      ? 'bg-indigo-950/80 border-indigo-600/70 text-indigo-300 font-bold opacity-100 cursor-default'
                      : isExcluded
                      ? 'bg-slate-950/60 border-slate-800 text-slate-500 line-through opacity-60 hover:opacity-100'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-indigo-500/60 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono truncate">{col}</span>
                    {isTarget ? (
                      <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                        Target
                      </span>
                    ) : colProfile?.isPotentialLeakage ? (
                      <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1 py-0.2 rounded font-sans">
                        Leakage?
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {colProfile?.type || 'feature'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabular Data Preview (First 8 Rows) */}
      {state.rawData.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-hidden shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white">
                Ingested Dataset Snapshot (Showing First 8 of {state.qualityReport.totalRows} Rows)
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>Target column highlighted</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="min-w-full divide-y divide-slate-800 text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-r border-slate-700/60">
                    #
                  </th>
                  {state.headers.map(h => {
                    const isTarget = h === state.targetColumn;
                    const isExcluded = state.directives.excludedColumns.includes(h);
                    const colProfile = state.qualityReport.columns.find(c => c.name === h);
                    return (
                      <th
                        key={h}
                        className={`px-3 py-2.5 text-left text-[11px] font-semibold tracking-wider ${
                          isTarget
                            ? 'bg-indigo-950/80 text-indigo-300 border-x border-indigo-700/50'
                            : isExcluded
                            ? 'text-slate-600 bg-slate-950/60 line-through'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{h}</span>
                          {isTarget && (
                            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                              Target
                            </span>
                          )}
                        </div>
                        <span className="block text-[10px] font-normal text-slate-400 font-sans mt-0.5">
                          {colProfile?.type || 'unknown'}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-300">
                {state.rawData.slice(0, 8).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 py-2 text-slate-500 font-sans border-r border-slate-800">
                      {idx + 1}
                    </td>
                    {state.headers.map(h => {
                      const isTarget = h === state.targetColumn;
                      const isExcluded = state.directives.excludedColumns.includes(h);
                      const val = row[h];
                      return (
                        <td
                          key={h}
                          className={`px-3 py-2 truncate max-w-[200px] ${
                            isTarget
                              ? 'bg-indigo-950/40 font-semibold text-indigo-300 border-x border-indigo-900/30'
                              : isExcluded
                              ? 'text-slate-600 bg-slate-950/30'
                              : ''
                          }`}
                        >
                          {val !== null && val !== undefined ? String(val) : (
                            <span className="text-amber-500 italic">null</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
