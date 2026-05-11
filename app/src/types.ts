/**
 * Predictive Maintenance Types
 */

export interface MachineData {
  UDI?: number | string;
  "Product ID"?: string;
  Type: "L" | "M" | "H" | string;
  "Air temperature [K]": number;
  "Process temperature [K]": number;
  "Rotational speed [rpm]": number;
  "Torque [Nm]": number;
  "Tool wear [min]": number;
  "Machine failure": number;
  TWF?: number;
  HDF?: number;
  PWF?: number;
  OSF?: number;
  RNF?: number;
  [key: string]: any;
}

export type MachineType = "L" | "M" | "H";

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  predictedPositives: number;
  predictedNegatives: number;
  crossValidationScore?: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface TrainingResult {
  modelName: string;
  metrics: ModelMetrics;
  model: any; // The trained model instance
  timestamp: string;
  featureImportances?: FeatureImportance[];
}

export enum ModelType {
  LOGISTIC_REGRESSION = "Logistic Regression",
  DECISION_TREE = "Decision Tree",
  RANDOM_FOREST = "Random Forest",
  GRADIENT_BOOSTING = "Gradient Boosting",
  KNN = "K-Nearest Neighbors",
  SVM = "Support Vector Machine",
  NAIVE_BAYES = "Naive Bayes"
}

export interface PredictionFeatures {
  type: MachineType;
  airTemp: number;
  processTemp: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
}

export interface PredictionResult {
  failureProbability: number;
  isFailure: boolean;
  status: "Normal" | "Atenção" | "Alto Risco";
  reasoning: string[];
}
