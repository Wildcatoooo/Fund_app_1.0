import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavigationContext } from '../App';
import { GoogleGenAI, Type } from "@google/genai";
import Tesseract from 'tesseract.js';
import { recognizeAliyunOcr } from '../utils/aliyunOcr';

type ScannedFund = {
  id: string;
  fundName: string;
  amount: number;
  holdingReturn: number;
  returnRate: string;
  fundCode: string;
};

export default function ImageScanModal() {
  const { closeModal, openModal, navigate, fundMemory, upsertFundMemory, addFund, currentScreen } = useContext(NavigationContext);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedFunds, setScannedFunds] = useState<ScannedFund[]>([]);
  const [ocrEngine, setOcrEngine] = useState<'gemini' | 'aliyun'>('gemini');
  const [aliyunAk, setAliyunAk] = useState('');
  const [aliyunSk, setAliyunSk] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAk = localStorage.getItem('aliyun_ak');
    const savedSk = localStorage.getItem('aliyun_sk');
    const savedEngine = localStorage.getItem('ocr_engine') as 'gemini' | 'aliyun';
    if (savedAk) setAliyunAk(savedAk);
    
    if (savedSk) setAliyunSk(savedSk);
    
    if (savedEngine) setOcrEngine(savedEngine);
  }, []);

  const handleEngineChange = (engine: 'gemini' | 'aliyun') => {
    setOcrEngine(engine);
    localStorage.setItem('ocr_engine', engine);
  };

  const saveAliyunKeys = (ak: string, sk: string) => {
    setAliyunAk(ak);
    setAliyunSk(sk);
    localStorage.setItem('aliyun_ak', ak);
    localStorage.setItem('aliyun_sk', sk);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const matchFundCode = async (fundName: string): Promise<string> => {
    // 1. Try local memory fuzzy match first (simpler for this demo)
    const localMatch = fundMemory.find(m => m.fundName.includes(fundName) || fundName.includes(m.fundName));
    if (localMatch) return localMatch.fundCode;

    // 2. Try network API
    try {
      const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${fundName}`)}`);
      const data = await response.json();
      if (data && data.Datas && data.Datas.length > 0) {
        return data.Datas[0].CODE;
      }
    } catch (e) {
      console.error('Failed to match fund code from network', e);
    }

    return '代码待补充';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      setScanning(true);
      
      try {
        const parts: any[] = [];
        
        // Read all files as base64
        for (const file of files) {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          parts.push({
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          });
        }
        
        parts.push({
          text: "提取图片中的基金持仓数据。每一行包含：基金名称、持有金额、持有收益、持有收益率。请严格提取这4个字段，不要编造数据。如果没有匹配的数据，请忽略。",
        });

        let extractedData: any[] = [];

        const runRegexParser = (text: string, wordsInfo?: any[]) => {
          const data: any[] = [];
          let lines: string[] = [];
          
          if (wordsInfo && wordsInfo.length > 0) {
            const rows: {y: number, text: string}[] = [];
            wordsInfo.forEach(w => {
              const y = w.pos && w.pos.length > 0 ? w.pos[0].y : 0;
              const existingRow = rows.find(r => Math.abs(r.y - y) < 15);
              if (existingRow) {
                existingRow.text += ' ' + w.word;
              } else {
                rows.push({y, text: w.word});
              }
            });
            rows.sort((a, b) => a.y - b.y);
            lines = rows.map(r => r.text);
          } else {
            lines = text.split('\n');
          }

          // 匹配：名称 金额 收益 收益率 (可能包含空格)
          const regex = /([^\d\s]+.*?)\s+(-?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?%?)/;
          for (const line of lines) {
            const match = line.trim().match(regex);
            if (match) {
              let parsedName = match[1].trim();
              let matchedCode = '';
              
              // Fuzzy match with memory bank
              if (fundMemory && fundMemory.length > 0) {
                const bestMatch = fundMemory.find(f => 
                  parsedName.includes(f.fundName) || f.fundName.includes(parsedName)
                );
                if (bestMatch) {
                  parsedName = bestMatch.fundName;
                  matchedCode = bestMatch.fundCode;
                }
              }

              data.push({
                fundName: parsedName,
                fundCode: matchedCode,
                amount: parseFloat(match[2]),
                holdingReturn: parseFloat(match[3]),
                returnRate: match[4].includes('%') ? match[4] : `${match[4]}%`
              });
            }
          }
          return data;
        };

        const runTesseractFallback = async (filesToScan: File[]) => {
          const data: any[] = [];
          for (const file of filesToScan) {
            const result = await Tesseract.recognize(file, 'chi_sim+eng');
            data.push(...runRegexParser(result.data.text));
          }
          if (data.length === 0) throw new Error('Local OCR could not extract structured data');
          return data;
        };

        try {
          if (ocrEngine === 'aliyun') {
            if (!aliyunAk || !aliyunSk) {
              throw new Error('Aliyun AK/SK not configured');
            }
            // Use Aliyun OCR
            for (const file of files) {
              const result = await recognizeAliyunOcr(aliyunAk, aliyunSk, file);
              if (result && result.Data) {
                const content = result.Data.content || '';
                const wordsInfo = result.Data.prism_wordsInfo;
                const parsed = runRegexParser(content, wordsInfo);
                extractedData.push(...parsed);
              }
            }
            // Do not throw error if empty, just show empty popup
          } else {
            // 1. Attempt to use Gemini first (Best performance, requires VPN in China)
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fundName: { type: Type.STRING, description: "基金名称" },
                    amount: { type: Type.NUMBER, description: "持有金额" },
                    holdingReturn: { type: Type.NUMBER, description: "持有收益金额" },
                    returnRate: { type: Type.STRING, description: "持有收益率，带百分号" },
                  },
                  required: ["fundName", "amount", "holdingReturn", "returnRate"],
                },
              },
            },
          });

          const jsonStr = response.text || "[]";
          extractedData = JSON.parse(jsonStr);
          }
        } catch (geminiError) {
          console.warn('Gemini OCR failed, falling back to Chinese AI (Zhipu GLM-4V)', geminiError);
          
          // 2. Fallback to Zhipu GLM-4V (Works in China without VPN)
          const zhipuKey = (import.meta as any).env.VITE_ZHIPU_API_KEY;
          if (zhipuKey) {
            try {
              const zhipuContent: any[] = [
                { type: 'text', text: '提取图片中的基金持仓数据。每一行包含：基金名称、持有金额、持有收益、持有收益率。请严格提取这4个字段，不要编造数据。请直接返回JSON数组格式，例如：[{"fundName": "易方达", "amount": 1000, "holdingReturn": 10, "returnRate": "1.00%"}]。不要输出其他markdown标记。' }
              ];
              
              for (const file of files) {
                const base64Data = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                zhipuContent.push({
                  type: 'image_url',
                  image_url: { url: `data:${file.type};base64,${base64Data}` }
                });
              }

              const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${zhipuKey}`
                },
                body: JSON.stringify({
                  model: 'glm-4v',
                  messages: [{ role: 'user', content: zhipuContent }]
                })
              });
              
              const data = await response.json();
              if (data.choices && data.choices.length > 0) {
                const resultText = data.choices[0].message.content;
                const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
                extractedData = JSON.parse(jsonStr);
              } else {
                throw new Error('Zhipu API returned invalid format');
              }
            } catch (zhipuError) {
              console.warn('Zhipu OCR failed, falling back to local Tesseract OCR', zhipuError);
              extractedData = await runTesseractFallback(files);
            }
          } else {
            console.warn('No Zhipu API key found, falling back to local Tesseract OCR');
            // 3. Fallback to Local Tesseract OCR (Offline, no network required)
            extractedData = await runTesseractFallback(files);
          }
        }
        
        const processedFunds: ScannedFund[] = [];
        for (let i = 0; i < extractedData.length; i++) {
          const item = extractedData[i];
          const code = await matchFundCode(item.fundName);
          processedFunds.push({
            id: Date.now().toString() + i,
            fundName: item.fundName,
            amount: item.amount,
            holdingReturn: item.holdingReturn,
            returnRate: item.returnRate,
            fundCode: code
          });
        }
        
        setScannedFunds(processedFunds);
        setScanning(false);
        setScanned(true);
      } catch (error) {
        console.error('OCR failed', error);
        setScanning(false);
        alert('识别失败，请检查网络或重试。如果无网络，请确保图片清晰且排版规范。');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleCodeChange = async (index: number, newCode: string) => {
    const updatedFunds = [...scannedFunds];
    updatedFunds[index].fundCode = newCode;
    
    // Reverse lookup name by code
    if (/^\d{6}$/.test(newCode)) {
      try {
        const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundgz.1234567.com.cn/js/${newCode}.js?rt=${Date.now()}`)}`);
        const text = await response.text();
        const match = text.match(/jsonpgz\((.*)\)/);
        if (match) {
          const data = JSON.parse(match[1]);
          updatedFunds[index].fundName = data.name;
        } else {
          alert('该代码无对应基金，请核对');
        }
      } catch (e) {
        console.error('Failed to fetch name by code', e);
      }
    }
    
    setScannedFunds(updatedFunds);
  };

  const [isBatchAdding, setIsBatchAdding] = useState(false);
  const [batchInput, setBatchInput] = useState('');

  const handleBatchAdd = async () => {
    if (!batchInput.trim()) {
      setIsBatchAdding(false);
      return;
    }
    
    const lines = batchInput.split('\n').map(l => l.trim()).filter(l => l);
    const newFunds: ScannedFund[] = [];
    
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const code = parts[0];
        const amt = parseFloat(parts[1]);
        if (/^\d{6}$/.test(code) && !isNaN(amt)) {
          let name = code;
          try {
            const fallbackResponse = await fetch(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&Fcodes=${code}`);
            const fallbackData = await fallbackResponse.json();
            if (fallbackData && fallbackData.Datas && fallbackData.Datas.length > 0) {
              name = fallbackData.Datas[0].SHORTNAME;
            }
          } catch (e) {}
          
          newFunds.push({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            fundName: name,
            amount: amt,
            holdingReturn: 0,
            returnRate: '0.00%',
            fundCode: code
          });
        }
      }
    }
    
    setScannedFunds([...scannedFunds, ...newFunds]);
    setBatchInput('');
    setIsBatchAdding(false);
  };

  const handleDelete = (index: number) => {
    const updatedFunds = [...scannedFunds];
    updatedFunds.splice(index, 1);
    setScannedFunds(updatedFunds);
  };

  const handleConfirm = () => {
    scannedFunds.forEach(fund => {
      if (fund.fundCode !== '代码待补充' && /^\d{6}$/.test(fund.fundCode)) {
        // Save to memory DB
        upsertFundMemory(fund.fundCode, fund.fundName);
        
        // Add to main funds list
        const returnRateNum = parseFloat(fund.returnRate.replace('%', ''));
        addFund({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          name: fund.fundName,
          code: fund.fundCode,
          amount: fund.amount,
          returnRate: 0, // Today's return will be fetched
          totalReturnRate: isNaN(returnRateNum) ? 0 : returnRateNum,
          group: '未分组',
          isUp: true,
          isStarred: currentScreen === 'favorites',
          inPortfolio: currentScreen !== 'favorites',
          nav: '未知',
          tag: null,
          color: 'from-slate-500 to-slate-700',
          initials: fund.fundName.substring(0, 2).toUpperCase()
        });
      }
    });
    closeModal();
    if (currentScreen !== 'favorites') {
      navigate('home');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#192633]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">图片识别</h2>
        <button onClick={closeModal} className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
        {!scanning && !scanned && (
          <div className="w-full max-w-sm flex flex-col gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">选择识别引擎</h3>
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => handleEngineChange('gemini')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${ocrEngine === 'gemini' ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                >
                  Gemini (智能/需VPN)
                </button>
                <button 
                  onClick={() => handleEngineChange('aliyun')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${ocrEngine === 'aliyun' ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                >
                  阿里云 OCR (高精)
                </button>
              </div>
              
              {ocrEngine === 'aliyun' && (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">AccessKey ID</label>
                    <input 
                      type="text" 
                      value={aliyunAk}
                      onChange={(e) => saveAliyunKeys(e.target.value, aliyunSk)}
                      placeholder="输入阿里云 AK"
                      className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">AccessKey Secret</label>
                    <input 
                      type="password" 
                      value={aliyunSk}
                      onChange={(e) => saveAliyunKeys(aliyunAk, e.target.value)}
                      placeholder="输入阿里云 SK"
                      className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    提示：由于浏览器跨域限制，阿里云OCR请求将通过代理转发。请确保您的AK/SK拥有 <b>ocr:RecognizeAdvanced</b> 权限。
                  </p>
                </div>
              )}
            </div>

            <div 
              onClick={() => {
                if (ocrEngine === 'aliyun' && (!aliyunAk || !aliyunSk)) {
                  alert('请先配置阿里云 AccessKey ID 和 Secret');
                  return;
                }
                handleUploadClick();
              }}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">add_photo_alternate</span>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">点击上传图片</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">支持多张包含基金信息的截图</p>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        )}

        {scanning && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-24">
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary animate-pulse">document_scanner</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">正在识别中...</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">请稍候，AI正在提取基金信息</p>
          </div>
        )}

        {scanned && (
          <div className="flex flex-col items-center w-full">
            <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-emerald-500">check_circle</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">识别成功</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">已提取 {scannedFunds.length} 条基金记录</p>
            
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4 max-h-[40vh] overflow-y-auto">
              {scannedFunds.map((fund, index) => (
                <div key={fund.id} className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:mb-0 last:pb-0 last:border-0 relative">
                  <button onClick={() => handleDelete(index)} className="absolute -right-2 -top-2 text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-[10px] text-slate-500">基金代码</label>
                      <input 
                        value={fund.fundCode}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        className={`w-full text-sm font-mono bg-white dark:bg-slate-900 border rounded px-2 py-1 ${fund.fundCode === '代码待补充' ? 'border-red-300 text-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">基金名称</label>
                      <input 
                        value={fund.fundName}
                        onChange={(e) => {
                          const updated = [...scannedFunds];
                          updated[index].fundName = e.target.value;
                          setScannedFunds(updated);
                        }}
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">金额</label>
                      <input 
                        type="number"
                        value={fund.amount}
                        onChange={(e) => {
                          const updated = [...scannedFunds];
                          updated[index].amount = parseFloat(e.target.value) || 0;
                          setScannedFunds(updated);
                        }}
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">持有收益</label>
                      <input 
                        type="number"
                        value={fund.holdingReturn}
                        onChange={(e) => {
                          const updated = [...scannedFunds];
                          updated[index].holdingReturn = parseFloat(e.target.value) || 0;
                          setScannedFunds(updated);
                        }}
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">收益率</label>
                      <input 
                        value={fund.returnRate}
                        onChange={(e) => {
                          const updated = [...scannedFunds];
                          updated[index].returnRate = e.target.value;
                          setScannedFunds(updated);
                        }}
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {isBatchAdding ? (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">批量输入 (基金代码 金额)</label>
                  <textarea 
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="例如：&#10;000001 1000&#10;000002 2000"
                    className="w-full h-32 p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setIsBatchAdding(false)} className="flex-1 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold">取消</button>
                    <button onClick={handleBatchAdd} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold">确认添加</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => {
                    setScannedFunds([...scannedFunds, {
                      id: Date.now().toString(),
                      fundName: '待输入',
                      amount: 0,
                      holdingReturn: 0,
                      returnRate: '0.00%',
                      fundCode: '代码待补充'
                    }]);
                  }} className="flex-1 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-1 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    添加一条记录
                  </button>
                  <button onClick={() => setIsBatchAdding(true)} className="flex-1 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-1 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">list</span>
                    批量输入
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => { setScanned(false); setScanning(false); setScannedFunds([]); }}
                className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                重新上传
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
              >
                确认导入
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}