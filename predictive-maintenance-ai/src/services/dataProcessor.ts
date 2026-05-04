import Papa from 'papaparse';
import { MachineData, ModelMetrics } from '../types';

export class DataProcessor {
  /**
   * Parse raw CSV text to MachineData array
   */
  static parseCSV(csvText: string): Promise<MachineData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as MachineData[]);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Cleans data: handles column mapping, removes identifiers, and handles missing values
   */
  static cleanData(data: any[]): MachineData[] {
    const cleaned = data.map(row => {
      // Helper to find column case-insensitively and trimmed
      const findVal = (prefixes: string[], exact = false) => {
        const key = Object.keys(row).find(k => {
          const cleanK = k.trim().toLowerCase();
          if (exact) return prefixes.some(p => cleanK === p.toLowerCase());
          return prefixes.some(p => cleanK.includes(p.toLowerCase()));
        });
        return key ? row[key] : undefined;
      };

      const target: MachineData = {
        Type: findVal(["type"], true) || "L",
        "Air temperature [K]": findVal(["air temperature", "air_temp", "temp_ar"]) || 0,
        "Process temperature [K]": findVal(["process temperature", "process_temp", "temp_proc"]) || 0,
        "Rotational speed [rpm]": findVal(["rotational speed", "rpm", "speed", "velocidade"]) || 0,
        "Torque [Nm]": findVal(["torque"]) || 0,
        "Tool wear [min]": findVal(["tool wear", "tool_wear", "operational hours", "horas_op"]) || 0,
        "Machine failure": 0
      };

      // 1. Prioritize direct "Machine failure" column if it exists and has variation
      const directFailure = findVal(["machine failure"], true) || findVal(["machine_failure"], true) || findVal(["falha"], true);
      
      // 2. Look for "Failure Type" to derive failure status
      const failureType = findVal(["failure type"], true) || findVal(["failure_type"], true) || findVal(["tipo de falha"], true) || findVal(["target"], true);

      if (failureType !== undefined) {
        const typeStr = String(failureType).trim().toLowerCase();
        // If it says "No Failure" or similar synonyms, it's 0. Anything else is a failure (1).
        if (typeStr === 'no failure' || typeStr === 'no_failure' || typeStr === '0' || typeStr === 'none' || typeStr === 'ok' || typeStr === '') {
          target["Machine failure"] = 0;
        } else {
          target["Machine failure"] = 1;
        }
      } else if (directFailure !== undefined) {
        // Fallback to direct failure column logic
        if (typeof directFailure === 'string') {
          const s = directFailure.trim().toLowerCase();
          target["Machine failure"] = (s === '1' || s === 'true' || s === 'yes' || s === 'fail') ? 1 : 0;
        } else {
          target["Machine failure"] = (directFailure === 1 || directFailure === true) ? 1 : 0;
        }
      }

      return target;
    });

    // Logging counts for transparency
    const f0 = cleaned.filter(r => r["Machine failure"] === 0).length;
    const f1 = cleaned.filter(r => r["Machine failure"] === 1).length;
    console.log(`Pipeline Sync: Foram detectados ${f1} registros de falha baseados na coluna "Failure Type".`);

    return cleaned.filter(row => {
      const airTemp = Number(row["Air temperature [K]"]);
      const torque = Number(row["Torque [Nm]"]);
      return !isNaN(airTemp) && !isNaN(torque); // Simplified filter
    });
  }

  /**
   * Encodes categorical 'Type': L=0, M=1, H=2
   */
  static encodeType(type: string): number {
    switch (type) {
      case 'L': return 0;
      case 'M': return 1;
      case 'H': return 2;
      default: return 0;
    }
  }

  /**
   * Prepares feature matrix (X) and target vector (y) with normalization
   */
  static prepareXY(data: MachineData[]): { X: number[][], y: number[], scaler: { means: number[], stds: number[] } } {
    if (data.length === 0) {
      return { X: [], y: [], scaler: { means: [], stds: [] } };
    }
    const rawX = data.map(row => [
      this.encodeType(row.Type),
      Number(row["Air temperature [K]"]),
      Number(row["Process temperature [K]"]),
      Number(row["Rotational speed [rpm]"]),
      Number(row["Torque [Nm]"]),
      Number(row["Tool wear [min]"])
    ]);
    const y = data.map(row => row["Machine failure"]);

    // Simple Standardization (Z-score)
    const means = rawX[0].map((_, col) => rawX.reduce((acc, row) => acc + row[col], 0) / rawX.length);
    const stds = rawX[0].map((_, col) => Math.sqrt(rawX.reduce((acc, row) => acc + Math.pow(row[col] - means[col], 2), 0) / rawX.length) || 1);

    const X = rawX.map(row => row.map((val, col) => (val - means[col]) / stds[col]));

    return { X, y, scaler: { means, stds } };
  }

  /**
   * Split data into Training and Testing sets with Stratification
   */
  static splitData(X: number[][], y: number[], trainRatio = 0.7) {
    const indices = Array.from({ length: X.length }, (_, i) => i);
    const class0Idx = indices.filter(i => y[i] === 0).sort(() => Math.random() - 0.5);
    const class1Idx = indices.filter(i => y[i] === 1).sort(() => Math.random() - 0.5);

    const split0 = Math.floor(class0Idx.length * trainRatio);
    const split1 = Math.floor(class1Idx.length * trainRatio);

    const trainIdx = [...class0Idx.slice(0, split0), ...class1Idx.slice(0, split1)].sort(() => Math.random() - 0.5);
    const testIdx = [...class0Idx.slice(split0), ...class1Idx.slice(split1)].sort(() => Math.random() - 0.5);

    return {
      X_train: trainIdx.map(i => X[i]),
      y_train: trainIdx.map(i => y[i]),
      X_test: testIdx.map(i => X[i]),
      y_test: testIdx.map(i => y[i])
    };
  }

  /**
  /**
   * Robust Oversampling to balance classes 1:1 using Bootstrapping
   */
  static balanceData(X: number[][], y: number[]): { X_resampled: number[][], y_resampled: number[] } {
    const class0 = X.filter((_, i) => y[i] === 0);
    const class1 = X.filter((_, i) => y[i] === 1);

    if (class1.length === 0) {
      console.warn("CRITICAL: No failure samples found in training set. Prediction will be biased.");
      return { X_resampled: X, y_resampled: y };
    }

    const resampledX: number[][] = [];
    const resampledy: number[] = [];

    // Find the larger class size, but cap it to 1000 per class (2000 total)
    // for brownser performance and to avoid memory issues with some libraries.
    const targetSize = Math.min(Math.max(class0.length, class1.length), 1000);

    // Bootstrap both to targetSize for perfect balance
    for (let i = 0; i < targetSize; i++) {
       // Majority class sampling
       resampledX.push(class0[i % class0.length]);
       resampledy.push(0);
       
       // Minority class sampling (oversampling)
       resampledX.push(class1[i % class1.length]);
       resampledy.push(1);
    }

    console.log(`Dataset Balanced: Total samples ${resampledy.length} (Class 1: ${resampledy.filter(v => v === 1).length})`);
    return { X_resampled: resampledX, y_resampled: resampledy };
  }

  /**
   * Calculate classification metrics with flexible threshold
   */
  static calculateMetrics(y_true: number[], y_pred: number[]): ModelMetrics {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    for (let i = 0; i < y_true.length; i++) {
      const pred = y_pred[i]; // Input should already be processed by threshold
      const actual = y_true[i];
      
      if (actual === 1 && pred === 1) tp++;
      else if (actual === 0 && pred === 1) fp++;
      else if (actual === 0 && pred === 0) tn++;
      else if (actual === 1 && pred === 0) fn++;
    }

    const accuracy = (tp + tn) / y_true.length;
    const precision = (tp + fp) === 0 ? 0 : tp / (tp + fp);
    const recall = (tp + fn) === 0 ? 0 : tp / (tp + fn);
    const f1Score = (precision + recall) === 0 ? 0 : 2 * (precision * recall) / (precision + recall);

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix: { tp, fp, tn, fn },
      predictedPositives: tp + fp,
      predictedNegatives: tn + fn
    };
  }
}
