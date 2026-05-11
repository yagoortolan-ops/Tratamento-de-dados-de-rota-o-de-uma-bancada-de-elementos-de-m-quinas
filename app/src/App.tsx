import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  Database, 
  Download, 
  FileSearch, 
  FlaskConical, 
  GitBranch,
  History, 
  Info, 
  Layers, 
  Loader2, 
  Play, 
  Settings, 
  Shield, 
  Trees,
  Upload, 
  Users,
  Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataProcessor } from './services/dataProcessor';
import { ModelService } from './services/modelService';
import { MachineData, ModelType, TrainingResult, PredictionFeatures, PredictionResult } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons & UI Parts ---

const Card = ({ children, className, title, icon: Icon, subtitle }: { children: React.ReactNode, className?: string, title?: string, icon?: any, subtitle?: string }) => (
  <div className={cn("bg-[#0f0f0f] border border-slate-800 rounded-xl overflow-hidden", className)}>
    {(title || Icon) && (
      <div className="px-5 py-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-blue-500" />}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
            {subtitle && <p className="text-[10px] text-slate-600 font-mono mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

const MetricBadge = ({ label, value, color = "blue", border = false }: { label: string, value: string | number, color?: "blue" | "green" | "red" | "amber", border?: boolean }) => {
  const accentColors = {
    blue: "text-blue-400 border-l-blue-500",
    green: "text-emerald-400 border-l-emerald-500",
    red: "text-rose-400 border-l-rose-500",
    amber: "text-orange-400 border-l-orange-500"
  };
  return (
    <div className={cn(
      "bg-[#0f0f0f] border border-slate-800 p-4 rounded-lg transition-all",
      border && `border-l-2 ${accentColors[color]}`
    )}>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 opacity-80">{label}</span>
      <span className={cn("text-2xl font-mono text-white", accentColors[color].split(' ')[0])}>{value}</span>
    </div>
  );
};

// --- App Main ---

export default function App() {
  const [data, setData] = useState<MachineData[]>([]);
  const [trainingResults, setTrainingResults] = useState<TrainingResult[]>([]);
  const [selectedModel, setSelectedModel] = useState<TrainingResult | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<{
    total: { count0: number, count1: number, perc0: string, perc1: string },
    train: { count0: number, count1: number, perc0: string, perc1: string },
    test: { count0: number, count1: number, perc0: string, perc1: string }
  } | null>(null);
  
  // Predictor state
  const [features, setFeatures] = useState<PredictionFeatures>({
    type: "L",
    airTemp: 298.1,
    processTemp: 308.6,
    rotationalSpeed: 1551,
    torque: 42.8,
    toolWear: 0
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setDistributions(null); // Reset
    try {
      const text = await file.text();
      const rawData = await DataProcessor.parseCSV(text);
      const cleanData = DataProcessor.cleanData(rawData);
      
      if (cleanData.length === 0) {
        setError("NENHUM DADO VÁLIDO ENCONTRADO: O CSV não possui as colunas obrigatórias ou está vazio.");
        setData([]);
      } else {
        setData(cleanData);
      }
    } catch (err) {
      setError("ERRO NO PROCESSAMENTO DE DADOS: Formato CSV inválido ou corrompido.");
    } finally {
      // Clear the input value to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const runTraining = async () => {
    if (data.length === 0) return;
    
    setIsTraining(true);
    setError(null);
    
    await new Promise(r => setTimeout(r, 1500));

    try {
      const { X, y, scaler } = DataProcessor.prepareXY(data);
      const { X_train, y_train, X_test, y_test } = DataProcessor.splitData(X, y);
      
      // Calculate distributions
      const getCounts = (arr: number[]) => {
        const c0 = arr.filter(v => v === 0).length;
        const c1 = arr.filter(v => v === 1).length;
        const t = arr.length || 1;
        return {
          count0: c0,
          count1: c1,
          perc0: ((c0 / t) * 100).toFixed(1),
          perc1: ((c1 / t) * 100).toFixed(1)
        };
      };

      setDistributions({
        total: getCounts(y),
        train: getCounts(y_train),
        test: getCounts(y_test)
      });

      const results = await ModelService.trainAllModels(X_train, y_train, X_test, y_test, scaler);
      setTrainingResults(results);
      
      const best = [...results].sort((a, b) => b.metrics.f1Score - a.metrics.f1Score)[0];
      setSelectedModel(best);
    } catch (err) {
      setError("FALHA CRÍTICA NO TREINAMENTO: Verifique a dimensionalidade dos dados.");
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredict = () => {
    if (!selectedModel) return;
    const res = ModelService.predict(selectedModel.model, features, selectedModel.modelName as ModelType);
    setPrediction(res);
  };

  const summaryStats = useMemo(() => {
    if (data.length === 0) return null;
    const failures = data.filter(d => d["Machine failure"] === 1).length;
    return {
      total: data.length,
      failures,
      failureRate: ((failures / data.length) * 100).toFixed(1),
      avgTemp: (data.reduce((acc, d) => acc + d["Air temperature [K]"], 0) / data.length).toFixed(1)
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans p-4 md:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-light tracking-tighter text-white font-serif italic">
                PREDICTIVE<span className="text-blue-500 font-sans not-italic font-black ml-1">OPS</span>
              </h1>
              <div className="h-5 w-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Industrial Intelligence v4.2</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Maintenance Analysis & Failure Prediction System</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 pr-6 border-r border-slate-800">
               <div className="text-right">
                 <p className="text-[10px] text-slate-500 uppercase mb-0.5">Stream Status</p>
                 <p className={cn("text-xs font-mono flex items-center justify-end gap-1.5", data.length > 0 ? "text-emerald-400" : "text-slate-600")}>
                   <span className={cn("w-1.5 h-1.5 rounded-full", data.length > 0 ? "bg-emerald-400 animate-pulse" : "bg-slate-700")} />
                   {data.length > 0 ? "DATA_READY" : "WAITING_INPUT"}
                 </p>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => document.getElementById('csv-upload')?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all"
              >
                <Upload className="w-4 h-4" />
                Ingest CSV
              </button>
              <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              
              {data.length > 0 && (
                <button 
                  onClick={runTraining}
                  disabled={isTraining}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                  {isTraining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Execute Training
                </button>
              )}
            </div>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-rose-950/20 border border-rose-900/50 text-rose-400 rounded-lg flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>CRITICAL_ERROR: {error}</span>
          </div>
        )}

        {data.length > 0 && trainingResults.length > 0 && (
          <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Correção Aplicada: Resumo Técnico</p>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                  O erro anterior ocorria devido ao <span className="text-white font-bold">mapeamento incorreto</span>. 
                  Implementamos: (1) Mapeamento de "Failure Type" (Qualquer valor diferente de "No Failure" = 1), (2) Stratified Split para manter proporção de falhas no teste, (3) Oversampling (Bootstrap) no treino para balancear 1:1, e (4) Ajuste de Threshold (0.35) para maximizar o Recall.
                </p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!data.length ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="h-[50vh] flex flex-col items-center justify-center border border-slate-800 rounded-3xl bg-[#090909] relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent pointer-events-none" />
               <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-full mb-8 relative">
                 <Database className="w-12 h-12 text-slate-700" />
                 <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping pointer-events-none" />
               </div>
               <h2 className="text-xl font-light tracking-widest text-white uppercase mb-3">System Idle</h2>
               <p className="text-slate-500 max-w-sm text-center text-xs font-medium uppercase tracking-widest mb-8 leading-relaxed opacity-60">
                 Awaiting industrial sensor data payload to initialize predictive modeling engine.
               </p>
               <button 
                 onClick={() => document.getElementById('csv-upload')?.click()}
                 className="px-10 py-4 bg-white text-black rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform"
               >
                 Início via Upload
               </button>
             </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sidebar: Analytics Info */}
              <div className="lg:col-span-3 space-y-6">
                 {distributions && (
                    <Card title="Data Distribution" icon={Database}>
                      <div className="space-y-4">
                        {[
                          { label: 'Full Dataset', data: distributions.total },
                          { label: 'Training Set (70%)', data: distributions.train },
                          { label: 'Testing Set (30%)', data: distributions.test }
                        ].map((section, idx) => (
                          <div key={idx} className={cn("space-y-2", idx !== 0 && "pt-3 border-t border-slate-800/50")}>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{section.label}</p>
                            <div className="grid grid-cols-2 gap-2">
                               <div className="bg-slate-900/50 p-2 rounded border border-slate-800/50">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] text-slate-500 uppercase font-bold">Normal (0)</span>
                                    <span className="text-[9px] text-emerald-500 font-mono">{section.data.perc0}%</span>
                                  </div>
                                  <p className="text-sm font-black text-white font-mono">{section.data.count0}</p>
                               </div>
                               <div className="bg-rose-900/5 p-2 rounded border border-rose-900/10">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] text-rose-500/70 uppercase font-bold">Falha (1)</span>
                                    <span className="text-[9px] text-rose-400 font-mono">{section.data.perc1}%</span>
                                  </div>
                                  <p className="text-sm font-black text-rose-500 font-mono">{section.data.count1}</p>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                 )}
                 <Card title="System Context" icon={Activity}>
                    <div className="space-y-4">
                       <div className="pb-4 border-b border-slate-800/50">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Pipeline Status</p>
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-[11px] text-slate-300">
                               <div className="w-3.5 h-3.5 rounded bg-emerald-900/30 text-emerald-500 flex items-center justify-center text-[8px]">✓</div>
                               Data Cleansing Ready
                             </div>
                             <div className="flex items-center gap-2 text-[11px] text-slate-300">
                               <div className="w-3.5 h-3.5 rounded bg-emerald-900/30 text-emerald-500 flex items-center justify-center text-[8px]">✓</div>
                               Type Encoding (OHE)
                             </div>
                             <div className="flex items-center gap-2 text-[11px] text-slate-300">
                               <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center text-[8px]", trainingResults.length > 0 ? "bg-emerald-900/30 text-emerald-500" : "bg-blue-900/30 text-blue-500")}>
                                 {trainingResults.length > 0 ? "✓" : "…"}
                               </div>
                               Model Validation
                             </div>
                          </div>
                       </div>

                       <div className="pt-2">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-bold">Class Balance (Ratio de Falhas)</p>
                          <div className="h-44 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Normal', value: Math.max(0, (summaryStats?.total || 0) - (summaryStats?.failures || 0)) },
                                    { name: 'Falha', value: summaryStats?.failures || 0 }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={65}
                                  paddingAngle={8}
                                  dataKey="value"
                                  stroke="none"
                                >
                                  <Cell fill="#1e293b" />
                                  <Cell fill="#f43f5e" />
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                               <span className="text-[10px] text-slate-500 uppercase font-black">Taxa</span>
                               <span className="text-sm font-black text-white">
                                  {((summaryStats?.failures! / summaryStats?.total!) * 100).toFixed(1)}%
                               </span>
                            </div>
                          </div>
                          <div className="flex justify-center gap-4 text-[10px] uppercase font-bold tracking-widest mt-2">
                             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700" /> Operacional</span>
                             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Falha</span>
                          </div>
                       </div>
                    </div>
                 </Card>

                 <div className="bg-[#0f0f0f] border border-slate-800 rounded-xl p-6">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Settings className="w-3 h-3 text-blue-500" />
                       Algorithm Selection
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {trainingResults.map((res) => {
                        const getIcon = () => {
                           switch(res.modelName) {
                              case ModelType.LOGISTIC_REGRESSION: return Activity;
                              case ModelType.DECISION_TREE: return GitBranch;
                              case ModelType.RANDOM_FOREST: return Trees;
                              case ModelType.GRADIENT_BOOSTING: return Zap;
                              case ModelType.KNN: return Users;
                              case ModelType.SVM: return Shield;
                              case ModelType.NAIVE_BAYES: return FlaskConical;
                              default: return Cpu;
                           }
                        };
                        const Icon = getIcon();
                        
                        return (
                          <button 
                            key={res.modelName}
                            onClick={() => setSelectedModel(res)}
                            className={cn(
                              "w-full text-left p-3 rounded border text-[10px] font-bold uppercase transition-all flex items-center justify-between group",
                              selectedModel?.modelName === res.modelName 
                                ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                                : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                               <Icon className={cn("w-3.5 h-3.5", selectedModel?.modelName === res.modelName ? "text-blue-400" : "text-slate-700 group-hover:text-slate-500")} />
                               {res.modelName}
                            </div>
                            {selectedModel?.modelName === res.modelName && <CheckCircle className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                 </div>
              </div>
              
              {/* Main Column: Analysis */}
              <div className="lg:col-span-6 space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {summaryStats && (
                    <>
                      <MetricBadge label="System Volume" value={summaryStats.total} />
                      <MetricBadge label="Accuracy" value={selectedModel ? `${(selectedModel.metrics.accuracy * 100).toFixed(1)}%` : "--"} color="blue" border />
                      <MetricBadge label="Recall (Fail)" value={selectedModel ? `${(selectedModel.metrics.recall * 100).toFixed(1)}%` : "--"} color="amber" border />
                      <MetricBadge label="CV Score (F1)" value={selectedModel?.metrics.crossValidationScore ? `${(selectedModel.metrics.crossValidationScore * 100).toFixed(1)}%` : "--"} color="green" border />
                      <MetricBadge label="F1 Opt" value={selectedModel ? `${(selectedModel.metrics.f1Score * 100).toFixed(1)}` : "--"} color="blue" border />
                    </>
                  )}
                </div>

                {/* Main Visuals */}
                <Card title="Performance Signature" icon={BarChart} subtitle="Model sensitivity analysis per algorithm">
                   <div className="h-[240px] w-full mt-4 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trainingResults} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                          <XAxis 
                            dataKey="modelName" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fill: '#94a3b8' }} 
                            interval={0}
                          />
                          <YAxis 
                            domain={[0, 1]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#64748b' }} 
                          />
                          <Tooltip 
                            cursor={{ fill: '#ffffff', opacity: 0.05 }}
                            contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                          />
                          <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="circle" 
                            iconSize={8}
                            wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '10px' }}
                          />
                          <Bar name="Recall" dataKey="metrics.recall" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={28} />
                          <Bar name="Accuracy" dataKey="metrics.accuracy" fill="#334155" radius={[2, 2, 0, 0]} barSize={12} />
                          <Bar name="F1 Score" dataKey="metrics.f1Score" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={28} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </Card>

                {/* Feature Importance Section */}
                {selectedModel?.featureImportances && (
                  <Card title="Feature Importance" icon={Layers} subtitle="Variables that impact machine failure probability">
                    <div className="h-[200px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={selectedModel.featureImportances} margin={{ left: 10, right: 30 }}>
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="feature" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fill: '#94a3b8' }} 
                            width={100}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #1e293b', fontSize: '10px' }}
                          />
                          <Bar 
                            dataKey="importance" 
                            fill="#3b82f6" 
                            radius={[0, 4, 4, 0]}
                            barSize={12}
                          >
                            {selectedModel.featureImportances.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.importance > 25 ? '#3b82f6' : entry.importance > 10 ? '#6366f1' : '#1e293b'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}

                {/* Detailed Analysis Area */}
                {selectedModel && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Confusion Matrix" icon={Layers} subtitle={`Test Results for ${selectedModel.modelName}`}>
                      <div className="grid grid-cols-2 grid-rows-2 gap-2 text-center text-xs font-mono mt-2">
                        <div className="bg-slate-800/20 border border-slate-800 flex flex-col items-center justify-center rounded p-4">
                          <span className="text-slate-500 mb-1 text-[9px] uppercase tracking-widest font-bold">True Negative</span>
                          <span className="text-xl font-black text-white">{selectedModel.metrics.confusionMatrix.tn}</span>
                        </div>
                        <div className="bg-red-900/10 border border-red-900/20 flex flex-col items-center justify-center rounded p-4">
                          <span className="text-red-400/60 mb-1 text-[9px] uppercase tracking-widest font-bold">False Positive</span>
                          <span className="text-xl font-black text-red-500">{selectedModel.metrics.confusionMatrix.fp}</span>
                        </div>
                        <div className="bg-orange-900/10 border border-orange-900/20 flex flex-col items-center justify-center rounded p-4">
                          <span className="text-orange-400/60 mb-1 text-[9px] uppercase tracking-widest font-bold">False Negative</span>
                          <span className="text-xl font-black text-orange-500">{selectedModel.metrics.confusionMatrix.fn}</span>
                        </div>
                        <div className="bg-emerald-900/10 border border-emerald-900/20 flex flex-col items-center justify-center rounded p-4">
                          <span className="text-emerald-500/60 mb-1 text-[9px] uppercase tracking-widest font-bold">True Positive</span>
                          <span className="text-xl font-black text-emerald-400">{selectedModel.metrics.confusionMatrix.tp}</span>
                        </div>
                      </div>
                    </Card>

                    <Card title="Model Insights" icon={Info} subtitle="Engineering recommendation">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-900/10 border border-blue-900/20 rounded text-[11px] leading-relaxed italic text-blue-300">
                          <strong>Note:</strong> O modelo <b>{selectedModel.modelName}</b> foi priorizado pelo seu F1-Score elevado ({(selectedModel.metrics.f1Score * 100).toFixed(1)}%). Em manutenção preditiva, o Recall de {(selectedModel.metrics.recall * 100).toFixed(1)}% garante que capturamos a maioria das falhas potenciais.
                        </div>
                        <div className="pt-2">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Class Report Highlights</p>
                           <ul className="space-y-1 text-[11px] text-slate-400">
                              <li className="flex justify-between border-b border-slate-800 pb-1"><span>Precision (Fail)</span> <span className="text-white font-mono">{(selectedModel.metrics.precision * 100).toFixed(1)}%</span></li>
                              <li className="flex justify-between border-b border-slate-800 pb-1 pt-1"><span>Recall (Fail)</span> <span className="text-orange-400 font-mono">{(selectedModel.metrics.recall * 100).toFixed(1)}%</span></li>
                              <li className="flex justify-between border-b border-slate-800 pb-1 pt-1"><span>F1-Score</span> <span className="text-blue-400 font-mono">{(selectedModel.metrics.f1Score * 100).toFixed(1)}%</span></li>
                              <li className="flex justify-between pt-2 text-slate-500 font-bold uppercase text-[9px]"><span>Predições: Falha (1)</span> <span className="text-white">{selectedModel.metrics.predictedPositives}</span></li>
                              <li className="flex justify-between text-slate-500 font-bold uppercase text-[9px]"><span>Predições: Normal (0)</span> <span className="text-white">{selectedModel.metrics.predictedNegatives}</span></li>
                           </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Table Section */}
                <div className="bg-[#0f0f0f] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                   <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                     <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Asset Telemetry Sample</h3>
                     <span className="text-[10px] text-slate-600 font-mono">LATEST_10_RECORDS</span>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-[11px] text-left">
                       <thead>
                         <tr className="border-b border-slate-800/50 bg-[#0a0a0a]">
                           <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-tighter">Asset Type</th>
                           <th className="px-6 py-3 font-bold text-slate-500 uppercase text-right">Process (K)</th>
                           <th className="px-6 py-3 font-bold text-slate-500 uppercase text-right">Dyn. Load (Nm)</th>
                           <th className="px-6 py-3 font-bold text-slate-500 uppercase text-right">Condition</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/30">
                         {data.slice(0, 10).map((row, i) => (
                           <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                             <td className="px-6 py-3">
                               <div className="flex items-center gap-2">
                                 <span className={cn(
                                   "w-2 h-2 rounded-full",
                                   row.Type === 'H' ? "bg-purple-500" : row.Type === 'M' ? "bg-amber-500" : "bg-slate-500"
                                 )} />
                                 <span className="font-mono text-slate-300 tracking-wider font-bold">TYPE_{row.Type}</span>
                               </div>
                             </td>
                             <td className="px-6 py-3 text-right font-mono text-slate-400">{row["Process temperature [K]"]}</td>
                             <td className="px-6 py-3 text-right font-mono text-slate-400">{row["Torque [Nm]"]}</td>
                             <td className="px-6 py-3 text-right">
                               {row["Machine failure"] === 1 ? (
                                 <span className="text-rose-500 font-black tracking-widest italic uppercase text-[9px]">CRITICAL_FAIL</span>
                               ) : (
                                 <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-widest opacity-60">Nominal</span>
                               )}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </div>

              {/* Right Column: Engine */}
              <div className="lg:col-span-3 space-y-8">
                 <Card title="Inference Engine" icon={Settings} className="border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.05)]">
                    {!selectedModel ? (
                      <div className="text-center py-12 flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-slate-800 animate-spin mb-4" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Awaiting Model Initialization</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                         <div className="space-y-4">
                            {[
                               { label: 'Quality Type', key: 'type', type: 'select' },
                               { label: 'Air Temp (K)', key: 'airTemp' },
                               { label: 'Process Temp (K)', key: 'processTemp' },
                               { label: 'RPM Velocity', key: 'rotationalSpeed' },
                               { label: 'Torque Force (Nm)', key: 'torque' },
                               { label: 'Tool Wear Cycle', key: 'toolWear' }
                            ].map((f) => (
                              <div key={f.key} className="relative">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">{f.label}</label>
                                {f.type === 'select' ? (
                                  <select 
                                    value={(features as any)[f.key]}
                                    onChange={(e) => setFeatures({...features, [f.key]: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border-b border-slate-800 px-1 py-1.5 text-xs text-white outline-none focus:border-blue-500 font-mono appearance-none"
                                  >
                                    <option value="L">L_TYPE</option>
                                    <option value="M">M_TYPE</option>
                                    <option value="H">H_TYPE</option>
                                  </select>
                                ) : (
                                  <input 
                                    type="number"
                                    value={(features as any)[f.key]}
                                    onChange={(e) => setFeatures({...features, [f.key]: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-transparent border-b border-slate-800 px-1 py-1.5 text-sm text-white outline-none focus:border-blue-500 font-mono transition-colors"
                                  />
                                )}
                              </div>
                            ))}
                         </div>

                         <button 
                            onClick={handlePredict}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-lg mt-4 transition-all shadow-lg active:scale-95"
                         >
                           Analyze Machine State
                         </button>

                         <AnimatePresence>
                           {prediction && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               className={cn(
                                 "mt-6 p-5 rounded-xl border border-dashed flex flex-col text-center",
                                 prediction.status === "Normal" ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400" :
                                 prediction.status === "Atenção" ? "bg-orange-950/20 border-orange-900/50 text-orange-400" :
                                 "bg-rose-950/20 border-rose-900/50 text-rose-400"
                               )}
                             >
                                <p className="text-[10px] uppercase tracking-[0.2em] mb-1 font-bold opacity-60">Predicted State</p>
                                <h4 className="text-xl font-black uppercase tracking-tight mb-4">{prediction.status}</h4>
                                
                                <div className="space-y-3 pt-3 border-t border-white/5">
                                   {prediction.reasoning.map((r, i) => (
                                     <div key={i} className="flex items-start gap-2 text-[10px] text-left opacity-80 leading-relaxed italic">
                                        <div className="w-1 h-1 rounded-full bg-current mt-1 flex-shrink-0" />
                                        {r}
                                     </div>
                                   ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[9px] opacity-40">
                                   CONFIDENCE: {(prediction.failureProbability * 100).toFixed(2)}%
                                </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    )}
                 </Card>

                 <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Kernel Processing</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
                       Systems monitoring operational. All predictive buffers cleared. Real-time inference cycle: 12ms.
                    </p>
                 </div>
              </div>

            </div>
          )}
        </AnimatePresence>
        
        {/* Footer Status */}
        <footer className="mt-12 py-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 border-t border-slate-800 uppercase tracking-widest gap-4">
          <div className="flex gap-8">
            <span>Environment: Production 4.2.0</span>
            <span>Kernel: Scikit-Trained ESM</span>
            <span>Region: GLOBAL_DC_AWS</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5"><History className="w-3 h-3" /> System Uptime: 99.98%</span>
             <span className="text-slate-400 font-mono">ID: 0x8F2A9C</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
