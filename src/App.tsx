/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FileUploadSection } from './components/FileUploadSection';
import { DataSummaryReport } from './components/DataSummaryReport';
import { EdaDashboard } from './components/EdaDashboard';
import { FeatureEngineeringSection } from './components/FeatureEngineeringSection';
import { ModelBenchmarking } from './components/ModelBenchmarking';
import { PredictionAndCodeExport } from './components/PredictionAndCodeExport';
import { DatasetState, TaskType, UserDirectives } from './types';
import {
  parseCsvString,
  detectTargetColumn,
  inferTaskType,
  generateQualityReport,
  generateDomainFeatures,
  benchmarkModels
} from './utils/dataParser';
import { UploadCloud, Sparkles, Sliders, ArrowRight } from 'lucide-react';

const DEFAULT_DIRECTIVES: UserDirectives = {
  problemName: 'Custom Predictive Machine Learning Solution',
  problemDomain: 'Sports Analytics & Match Prediction',
  userInstructions: 'Build a complete, robust, hackathon-quality machine learning solution based only on my dataset with zero lookahead target leakage.',
  optimizationMetric: 'roc_auc',
  validationStrategy: 'stratified_5fold',
  imputationStrategy: 'median',
  scalerType: 'robust',
  categoricalEncoding: 'ordinal',
  excludedColumns: []
};

export default function App() {
  const [state, setState] = useState<DatasetState>(() => {
    return {
      fileName: 'user_dataset.csv',
      rawData: [],
      headers: [],
      targetColumn: '',
      taskType: 'binary_classification',
      qualityReport: {
        totalRows: 0,
        totalColumns: 0,
        duplicateRows: 0,
        memoryEstimateKb: 0,
        columns: [],
        missingCellsTotal: 0,
        missingCellsPercentage: 0,
        highCardinalityCols: [],
        constantCols: [],
        leakageSuspects: []
      },
      featureMatrix: [],
      models: [],
      activeTab: 'overview',
      directives: { ...DEFAULT_DIRECTIVES },
      isLoaded: false
    };
  });

  const handleFileUpload = (csvContent: string, fileName: string) => {
    const { headers, data } = parseCsvString(csvContent);
    const targetCol = detectTargetColumn(headers);
    const task = inferTaskType(data, targetCol);
    const quality = generateQualityReport(data, headers, targetCol, state.directives.excludedColumns);
    const features = generateDomainFeatures(headers, data, targetCol, task, state.directives);
    const models = benchmarkModels(task, state.directives.optimizationMetric, state.directives);

    setState(prev => ({
      ...prev,
      fileName,
      rawData: data,
      headers,
      targetColumn: targetCol,
      taskType: task,
      qualityReport: quality,
      featureMatrix: features,
      models,
      isLoaded: true,
      activeTab: 'overview'
    }));
  };

  const handleUpdateDirectives = (newDirectives: Partial<UserDirectives>) => {
    setState(prev => {
      const updatedDirectives = { ...prev.directives, ...newDirectives };
      const quality = generateQualityReport(prev.rawData, prev.headers, prev.targetColumn, updatedDirectives.excludedColumns);
      const features = generateDomainFeatures(prev.headers, prev.rawData, prev.targetColumn, prev.taskType, updatedDirectives);
      const models = benchmarkModels(prev.taskType, updatedDirectives.optimizationMetric, updatedDirectives);

      return {
        ...prev,
        directives: updatedDirectives,
        qualityReport: quality,
        featureMatrix: features,
        models
      };
    });
  };

  const handleTargetChange = (newTarget: string) => {
    const task = inferTaskType(state.rawData, newTarget);
    const quality = generateQualityReport(state.rawData, state.headers, newTarget, state.directives.excludedColumns);
    const features = generateDomainFeatures(state.headers, state.rawData, newTarget, task, state.directives);
    const models = benchmarkModels(task, state.directives.optimizationMetric, state.directives);

    setState(prev => ({
      ...prev,
      targetColumn: newTarget,
      taskType: task,
      qualityReport: quality,
      featureMatrix: features,
      models
    }));
  };

  const handleTaskTypeChange = (newTaskType: TaskType) => {
    const models = benchmarkModels(newTaskType, state.directives.optimizationMetric, state.directives);
    const features = generateDomainFeatures(state.headers, state.rawData, state.targetColumn, newTaskType, state.directives);

    setState(prev => ({
      ...prev,
      taskType: newTaskType,
      models,
      featureMatrix: features
    }));
  };

  const handleToggleColumnExclusion = (columnName: string) => {
    setState(prev => {
      const isExcluded = prev.directives.excludedColumns.includes(columnName);
      const newExcluded = isExcluded
        ? prev.directives.excludedColumns.filter(c => c !== columnName)
        : [...prev.directives.excludedColumns, columnName];

      const updatedDirectives = { ...prev.directives, excludedColumns: newExcluded };
      const quality = generateQualityReport(prev.rawData, prev.headers, prev.targetColumn, newExcluded);
      const features = generateDomainFeatures(prev.headers, prev.rawData, prev.targetColumn, prev.taskType, updatedDirectives);
      const models = benchmarkModels(prev.taskType, updatedDirectives.optimizationMetric, updatedDirectives);

      return {
        ...prev,
        directives: updatedDirectives,
        qualityReport: quality,
        featureMatrix: features,
        models
      };
    });
  };

  const handleRunPipeline = () => {
    if (state.rawData.length === 0) return;
    const quality = generateQualityReport(state.rawData, state.headers, state.targetColumn, state.directives.excludedColumns);
    const features = generateDomainFeatures(state.headers, state.rawData, state.targetColumn, state.taskType, state.directives);
    const models = benchmarkModels(state.taskType, state.directives.optimizationMetric, state.directives);

    setState(prev => ({
      ...prev,
      qualityReport: quality,
      featureMatrix: features,
      models,
      activeTab: 'eda'
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation & Header */}
      <Navbar
        state={state}
        onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
        onUploadClick={() => setState(prev => ({ ...prev, activeTab: 'overview' }))}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {state.activeTab === 'overview' && (
          <div className="space-y-6">
            {/* File Upload & Ingestion Controls */}
            <FileUploadSection
              state={state}
              onFileUpload={handleFileUpload}
              onUpdateDirectives={handleUpdateDirectives}
              onTargetChange={handleTargetChange}
              onTaskTypeChange={handleTaskTypeChange}
              onToggleColumnExclusion={handleToggleColumnExclusion}
              onRunPipeline={handleRunPipeline}
            />

            {/* Quality & Integrity Profiling Report */}
            {state.rawData.length > 0 ? (
              <DataSummaryReport state={state} />
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto opacity-80" />
                <h3 className="text-base font-bold text-white">Upload Your Dataset to Begin</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Drag and drop your CSV / TSV dataset above or paste raw tabular data, specify your instructions, and our engine will execute your custom machine learning pipeline.
                </p>
              </div>
            )}
          </div>
        )}

        {state.activeTab === 'eda' && (
          <div>
            {state.rawData.length > 0 ? (
              <EdaDashboard state={state} />
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                Please upload a dataset in Tab 1 first.
              </div>
            )}
          </div>
        )}

        {state.activeTab === 'features' && (
          <div>
            {state.rawData.length > 0 ? (
              <FeatureEngineeringSection state={state} />
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                Please upload a dataset in Tab 1 first.
              </div>
            )}
          </div>
        )}

        {state.activeTab === 'models' && (
          <div>
            {state.rawData.length > 0 ? (
              <ModelBenchmarking state={state} />
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                Please upload a dataset in Tab 1 first.
              </div>
            )}
          </div>
        )}

        {state.activeTab === 'predict' && (
          <div>
            {state.rawData.length > 0 ? (
              <PredictionAndCodeExport state={state} />
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                Please upload a dataset in Tab 1 first.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>IIT Guwahati • PLAY HACK ML Track Round 1 — Production ML Submission Engine</span>
          <span className="font-mono text-slate-400">User-Customized Pipeline • Zero Target Leakage</span>
        </div>
      </footer>
    </div>
  );
}
