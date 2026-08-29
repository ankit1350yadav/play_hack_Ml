export type TaskType = 'binary_classification' | 'multiclass_classification' | 'regression';

export type OptimizationMetric =
  | 'roc_auc'
  | 'f1_macro'
  | 'accuracy'
  | 'log_loss'
  | 'precision'
  | 'recall'
  | 'rmse'
  | 'mae'
  | 'r2';

export type ValidationStrategy =
  | 'stratified_5fold'
  | 'kfold_5'
  | 'kfold_10'
  | 'timeseries_split'
  | 'train_test_80_20';

export type ImputationStrategy = 'median' | 'mean' | 'mode' | 'constant' | 'drop_missing';
export type ScalerType = 'robust' | 'standard' | 'minmax' | 'none';
export type CategoricalEncoding = 'ordinal' | 'onehot' | 'target_oof' | 'frequency';

export interface ColumnProfile {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'boolean' | 'id_text';
  missingCount: number;
  missingPercentage: number;
  uniqueValues: number;
  sampleValues: (string | number)[];
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
  topCategories?: { value: string; count: number }[];
  isPotentialLeakage?: boolean;
  leakageReason?: string;
  isExcluded?: boolean;
}

export interface DataQualityReport {
  totalRows: number;
  totalColumns: number;
  duplicateRows: number;
  memoryEstimateKb: number;
  columns: ColumnProfile[];
  missingCellsTotal: number;
  missingCellsPercentage: number;
  highCardinalityCols: string[];
  constantCols: string[];
  leakageSuspects: string[];
}

export interface ModelResult {
  name: string;
  modelType: string;
  isBaseline?: boolean;
  isBest?: boolean;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    rocAuc?: number;
    logLoss?: number;
    mae?: number;
    rmse?: number;
    r2Score?: number;
    cvMean: number;
    cvStd: number;
  };
  trainTimeMs: number;
  advantages: string;
  disadvantages: string;
}

export interface EngineeredFeature {
  name: string;
  category: 'Form & Momentum' | 'Head-to-Head' | 'Venue & Context' | 'Strength Differential' | 'Rolling Aggregation' | 'Interaction' | 'Domain Transform' | 'Ratio & Diff';
  formula: string;
  reasoning: string;
  leakageGuard: string;
  importanceScore: number;
}

export interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  keyMetricOrInsight?: string;
  judgeNote?: string;
}

export interface UserDirectives {
  problemName: string;
  problemDomain: string;
  userInstructions: string;
  optimizationMetric: OptimizationMetric;
  validationStrategy: ValidationStrategy;
  imputationStrategy: ImputationStrategy;
  scalerType: ScalerType;
  categoricalEncoding: CategoricalEncoding;
  excludedColumns: string[];
}

export interface DatasetState {
  fileName: string;
  rawData: Record<string, any>[];
  headers: string[];
  targetColumn: string;
  taskType: TaskType;
  qualityReport: DataQualityReport;
  featureMatrix: EngineeredFeature[];
  models: ModelResult[];
  activeTab: 'overview' | 'eda' | 'features' | 'models' | 'predict';
  directives: UserDirectives;
  isLoaded: boolean;
}
