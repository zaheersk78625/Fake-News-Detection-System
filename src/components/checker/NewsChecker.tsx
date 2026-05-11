import React, {useState, useRef} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Search, AlertTriangle, CheckCircle, Info, RefreshCcw, ThumbsUp, ThumbsDown, FileImage, Mic, Type as TypeIcon, X, Upload, Scan} from 'lucide-react';
import {analyzeNews, analyzeMedia} from '../../services/aiService';
import {saveNewsCheck, submitFeedback} from '../../services/dbService';
import {cn, formatConfidence} from '../../lib/utils';
import {Prediction} from '../../types';
import {toast} from 'sonner';

export function NewsChecker() {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<{data: string, type: string, name: string, size: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selected: File) => {
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFile({
        data: reader.result as string,
        type: selected.type,
        name: selected.name,
        size: selected.size
      });
      toast.success('Media attached successfully');
    };
    reader.readAsDataURL(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

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
    const selected = e.dataTransfer.files?.[0];
    if (selected && (selected.type.startsWith('image/') || selected.type.startsWith('audio/'))) {
      processFile(selected);
    } else {
      toast.error('Please upload an image or audio file');
    }
  };

  const handleCheck = async () => {
    if (!input.trim() && !file) return;
    setLoading(true);
    setResult(null); // Clear previous result
    setFeedbackSubmitted(false);
    try {
      let analysis;
      if (file) {
        analysis = await analyzeMedia(file.data, file.type, input);
      } else {
        analysis = await analyzeNews(input);
      }
      const checkId = await saveNewsCheck({
        content: input || (file ? `Media: ${file.name}` : ''),
        ...analysis
      });
      setResult({...analysis, id: checkId});
      toast.success('Analysis complete!');
    } catch (error: any) {
      const message = error?.message || 'Analysis failed. Please try again.';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isCorrect: boolean) => {
    if (!result?.id) return;
    try {
      await submitFeedback({
        checkId: result.id,
        isCorrect,
      });
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getPredictionStyles = (prediction: Prediction) => {
    switch (prediction) {
      case 'Real': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Fake': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getPredictionIcon = (prediction: Prediction) => {
    switch (prediction) {
      case 'Real': return <CheckCircle className="w-8 h-8 text-emerald-600" />;
      case 'Fake': return <AlertTriangle className="w-8 h-8 text-rose-600" />;
      default: return <Info className="w-8 h-8 text-amber-600" />;
     }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Intelligence Checker</h2>
        <p className="text-slate-500 text-lg">Verify the authenticity of headlines, articles, or media files with advanced AI.</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => { setFile(null); setInput(''); }}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              !file ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <TypeIcon className="w-4 h-4" /> Text Analysis
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              file ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <FileImage className="w-4 h-4" /> Media Verification
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,audio/*"
          />
        </div>

        <div 
          className={cn(
            "relative group transition-all duration-300",
            isDragging ? "scale-[1.02]" : "scale-100"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="w-full bg-white border-2 border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 group/preview">
                    {file.type.startsWith('image/') ? (
                      <img src={file.data} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Mic className="w-10 h-10 text-slate-400" />
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setFile(null)}
                        className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-transform hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 truncate max-w-xs">{file.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">{(file.size / 1024).toFixed(1)} KB • {file.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="px-4 py-2 text-rose-600 bg-rose-50 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                >
                  Remove File
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Optional Context</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What specific claims are you verifying in this media?"
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-slate-100 focus:border-slate-200 focus:outline-none transition-all resize-none min-h-[120px]"
                />
              </div>
            </div>
          ) : isDragging ? (
            <div className="w-full h-64 bg-indigo-50 border-4 border-dashed border-indigo-300 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-indigo-600">
              <Upload className="w-16 h-16 animate-bounce" />
              <p className="text-xl font-bold">Drop your file here</p>
            </div>
          ) : (
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste news headline, article excerpt, or social media post content here..."
                className="w-full h-64 p-8 bg-white border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-slate-50 focus:border-slate-400 focus:outline-none transition-all resize-none shadow-sm text-lg group-hover:border-slate-300 leading-relaxed"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-3 rounded-2xl transition-all flex items-center gap-2 border border-slate-100"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-bold pr-1">Upload Media</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between px-2">
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5 opacity-40">
                  <Scan className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">OCR Ready</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-40">
                  <Mic className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Voice Audio Support</span>
                </div>
             </div>
             <span className={cn("text-[10px] font-mono", input.length > 4500 ? "text-red-500" : "text-slate-400")}>
              {input.length} / 5000 chars
            </span>
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || (!input.trim() && !file)}
          className="relative overflow-hidden bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-slate-200 group active:scale-[0.98]"
        >
          {loading ? (
            <>
              <RefreshCcw className="w-6 h-6 animate-spin" />
              <span className="z-10 tracking-wide uppercase text-sm font-black">AI is Analyzing...</span>
              <motion.div 
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/10 skew-x-12"
              />
            </>
          ) : (
            <>
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="tracking-wide uppercase text-sm font-black">Start Truth Analysis</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <div className={cn(
              "border-2 rounded-[2.5rem] p-10 flex flex-col lg:flex-row gap-12 items-start shadow-sm transition-colors duration-500",
              getPredictionStyles(result.prediction)
            )}>
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[1.5rem] shadow-sm">
                    {getPredictionIcon(result.prediction)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Global Verdict</p>
                    <h3 className="text-4xl font-black tracking-tight">{result.prediction} News</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/40 p-6 rounded-[2rem] border border-current/5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-wider font-black opacity-40 mb-3">AI Confidence Level</p>
                    <div className="flex items-end gap-2">
                       <p className="text-4xl font-mono font-black leading-none">{formatConfidence(result.confidence)}</p>
                       <div className="flex-1 h-3 bg-current/10 rounded-full mb-1">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            className="h-full bg-current rounded-full"
                          />
                       </div>
                    </div>
                  </div>
                  <div className="bg-white/40 p-6 rounded-[2rem] border border-current/5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-wider font-black opacity-40 mb-3">Primary Language</p>
                    <p className="text-2xl font-black leading-none">{result.language || 'Multi-lingual'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-0.5 flex-1 bg-current/10" />
                    <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Intelligence Reasoning</p>
                    <div className="h-0.5 flex-1 bg-current/10" />
                  </div>
                  <p className="text-lg font-medium leading-relaxed indent-8 selection:bg-current/20">
                    {result.explanation}
                  </p>
                </div>

                {result.transcription && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 flex-1 bg-current/10" />
                      <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Extracted / Transcribed Data</p>
                      <div className="h-0.5 flex-1 bg-current/10" />
                    </div>
                    <div className="bg-white/40 p-6 rounded-[2rem] border border-current/5 backdrop-blur-sm">
                      <p className="text-sm text-slate-700 italic leading-relaxed font-serif">
                        "{result.transcription}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-72 flex flex-col gap-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Tags</p>
                    <div className="h-1 w-12 bg-indigo-500" />
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {result.tags?.map((tag: string) => (
                      <span key={tag} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all cursor-default border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/50 p-8 rounded-[2rem] border border-current/5 space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Verify the Verifier</p>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Was this analysis accurate? Help train our neural network by providing feedback.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {feedbackSubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 p-4 rounded-2xl text-center"
                      >
                         <p className="text-xs text-emerald-700 font-black flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" /> REPORT SUBMITTED
                         </p>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleFeedback(true)}
                          className="py-3 bg-white hover:bg-emerald-500 hover:text-white border border-slate-200 rounded-2xl text-[10px] font-black transition-all group flex flex-col items-center gap-1"
                        >
                          <ThumbsUp className="w-4 h-4" /> ACCURATE
                        </button>
                        <button 
                          onClick={() => handleFeedback(false)}
                          className="py-3 bg-white hover:bg-rose-500 hover:text-white border border-slate-200 rounded-2xl text-[10px] font-black transition-all flex flex-col items-center gap-1"
                        >
                          <ThumbsDown className="w-4 h-4" /> MISLEADING
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
