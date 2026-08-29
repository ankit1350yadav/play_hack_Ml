import React, { useState } from 'react';
import { Trophy, Activity, Database, Sparkles, BarChart3, Layers, Cpu, Play, Sliders, UploadCloud, Archive, Check, Loader2 } from 'lucide-react';
import { DatasetState } from '../types';
import { triggerDownloadZip } from '../utils/zipExporter';

interface NavbarProps {
  state: DatasetState;
  onTabChange: (tab: DatasetState['activeTab']) => void;
  onUploadClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ state, onTabChange, onUploadClick }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const tabs = [
    { id: 'overview', label: '1. Ingestion & Directives', icon: Database },
    { id: 'eda', label: '2. EDA & Feature Analysis', icon: BarChart3 },
    { id: 'features', label: '3. Feature Engineering', icon: Layers },
    { id: 'models', label: '4. Model Benchmark', icon: Cpu },
    { id: 'predict', label: '5. Predict & Code Export', icon: Play },
  ] as const;

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await triggerDownloadZip(state);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                IIT Guwahati • PLAY HACK ML Track
              </span>
              <span className="text-xs text-slate-400">Custom Dataset ML Studio</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {state.directives.problemName || 'Custom Machine Learning Predictive Pipeline'}
            </h1>
          </div>
        </div>

        {/* Dataset Status Pill & Directives Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {state.rawData.length > 0 ? (
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-white truncate max-w-[130px]">{state.fileName}</span>
              </div>
              <span className="text-slate-500">•</span>
              <span>{state.qualityReport.totalRows} rows</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-300 font-medium">Target: <strong className="font-mono text-white">{state.targetColumn || 'None'}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs bg-amber-950/40 text-amber-300 border border-amber-800/40 px-3 py-1.5 rounded-xl">
              <Activity className="w-3.5 h-3.5" />
              <span>Awaiting User Dataset</span>
            </div>
          )}

          <button
            onClick={onUploadClick}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all border border-slate-700 flex items-center gap-1.5"
            title="Upload new dataset or change problem instructions"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload / Edit</span>
          </button>

          {/* Download Complete Project ZIP Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping || state.rawData.length === 0}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all border flex items-center gap-1.5 shadow-md ${
              state.rawData.length === 0
                ? 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed'
                : zipSuccess
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-500/50 text-white shadow-emerald-600/25'
            }`}
            title={state.rawData.length === 0 ? 'Upload a dataset first to export the complete ZIP project' : 'Download complete submission project ZIP containing code, data, models, and predictions'}
          >
            {isZipping ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Zipping...</span>
              </>
            ) : zipSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded ZIP!</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>Download Project (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar border-t border-slate-800/60">
        <nav className="flex space-x-1 py-1.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = state.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-sm shadow-indigo-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
