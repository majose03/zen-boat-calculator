import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Home, Anchor, ChevronRight, Save, Play, Check, MessageCircle, AlertCircle } from 'lucide-react';

interface CalcData {
  totalIncome: string;
  expenses: string;
  crewCount: string;
  ownerMultiplier: string;
}

const InputField = ({ labelEng, labelTam, value, onChange, type="number" }: { labelEng: string, labelTam: string, value: string, onChange: (value: string) => void, type?: string }) => (
  <div className="space-y-2 bg-gray-800/60 p-5 rounded-3xl border border-gray-700/50 shadow-inner">
    <label className="block">
      <div className="text-gray-100 font-bold text-xl">{labelEng}</div>
      <div className="text-pink-400 text-base mb-4 font-medium">{labelTam}</div>
      <input
        type={type}
        inputMode={type === 'number' ? "decimal" : "text"}
        pattern={type === 'number' ? "[0-9]*\\.?[0-9]*" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        className="w-full bg-gray-900 border-2 border-gray-700 focus:border-pink-500 outline-none rounded-2xl p-5 text-3xl font-bold text-white transition-colors"
        placeholder="0"
      />
    </label>
  </div>
);

export default function App() {
  const [screen, setScreen] = useState<'home' | 'calc' | 'result'>('home');
  const [data, setData] = useState<CalcData>({
    totalIncome: '',
    expenses: '',
    crewCount: '',
    ownerMultiplier: '1.5',
  });
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fishingCalcSave');
    if (saved) {
      setHasSavedData(true);
    }
    
    // Add dark mode styling to html
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#111827'; // gray-900
    document.body.style.color = '#ffffff';
  }, []);

  const loadSavedData = () => {
    const saved = localStorage.getItem('fishingCalcSave');
    if (saved) {
      setData(JSON.parse(saved));
      setScreen('result');
    }
  };

  const saveData = () => {
    localStorage.setItem('fishingCalcSave', JSON.stringify(data));
    setHasSavedData(true);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleInput = (field: keyof CalcData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const resetData = () => {
    setData({
      totalIncome: '',
      expenses: '',
      crewCount: '',
      ownerMultiplier: '1.5',
    });
    setScreen('calc');
  };

  const calculateResults = () => {
    const income = parseFloat(data.totalIncome) || 0;
    const exp = parseFloat(data.expenses) || 0;
    const remainingProfit = income - exp;
    
    const crew = parseInt(data.crewCount) || 0;
    const ownerMult = parseFloat(data.ownerMultiplier) || 0;
    
    const totalUnits = crew + ownerMult;
    const perUnit = totalUnits > 0 ? remainingProfit / totalUnits : 0;
    
    const crewShare = perUnit;
    const ownerShare = perUnit * ownerMult;

    return {
      remainingProfit,
      totalUnits,
      crewShare,
      ownerShare
    };
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="bg-pink-600 p-6 rounded-full shadow-[0_0_30px_rgba(219,39,119,0.4)]">
        <Anchor className="w-20 h-20 text-white" />
      </div>
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">Fishing Share</h1>
        <h2 className="text-2xl text-pink-400 font-bold tracking-wide">மீன்பிடி பங்கு</h2>
      </div>

      <div className="w-full max-w-sm space-y-5 mt-10 px-4">
        <button
          onClick={() => setScreen('calc')}
          className="w-full flex items-center justify-between bg-pink-600 hover:bg-pink-500 focus:bg-pink-700 text-white p-6 rounded-3xl text-xl font-bold transition-transform active:scale-95 shadow-xl shadow-pink-900/20"
        >
          <div className="text-left">
            <div className="text-2xl">New Calc</div>
            <div className="text-base font-normal text-pink-200 mt-1">புதிய கணக்கீடு</div>
          </div>
          <Play className="w-10 h-10 fill-current" />
        </button>

        {hasSavedData && (
          <button
            onClick={loadSavedData}
            className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 text-white p-6 rounded-3xl text-xl font-bold transition-transform active:scale-95 border-2 border-gray-700 shadow-lg"
          >
             <div className="text-left">
              <div className="text-2xl">Last Result</div>
              <div className="text-base font-normal text-gray-400 mt-1">முந்தைய முடிவு</div>
            </div>
            <RotateCcw className="w-10 h-10 text-pink-500" />
          </button>
        )}
      </div>
    </div>
  );

  const renderCalc = () => {
    const { remainingProfit } = calculateResults();

    const handleViewResults = () => {
      if (!data.totalIncome || !data.expenses || !data.crewCount || !data.ownerMultiplier) {
        setError('Please fill all fields / அனைத்து விவரங்களையும் நிரப்பவும்');
        window.scrollTo(0, 0);
        return;
      }
      setScreen('result');
    };
    
    return (
      <div className="pb-32 animate-in slide-in-from-right duration-300">
        <div className="flex items-center space-x-4 mb-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-4 border-b border-gray-800">
          <button onClick={() => setScreen('home')} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors">
            <Home className="w-7 h-7" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">Enter Details</h2>
            <p className="text-pink-400 text-base font-medium mt-1">விவரங்களை உள்ளிடவும்</p>
          </div>
        </div>

        <div className="space-y-5 px-1">
          {error && (
            <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-2xl flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          )}
          <InputField 
            labelEng="Total Income" 
            labelTam="மொத்த வருமானம்" 
            value={data.totalIncome} 
            onChange={(val) => handleInput('totalIncome', val)} 
          />
          <InputField 
            labelEng="Total Expenses" 
            labelTam="மொத்த செலவுகள்" 
            value={data.expenses} 
            onChange={(val) => handleInput('expenses', val)} 
          />

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border border-pink-900/30 flex justify-between items-center shadow-lg">
             <div>
               <div className="text-gray-200 font-bold text-xl">Remaining Profit</div>
               <div className="text-pink-400 text-base mt-1 font-medium">மீதமுள்ள லாபம்</div>
             </div>
             <div className="text-3xl font-black text-emerald-400">
               {remainingProfit.toFixed(2)}
             </div>
          </div>

          <InputField 
            labelEng="Crew Members (Count)" 
            labelTam="குழு உறுப்பினர்கள் (எண்ணிக்கை)" 
            value={data.crewCount} 
            onChange={(val) => handleInput('crewCount', val)} 
          />
          <InputField 
            labelEng="Owner Share Multiplier" 
            labelTam="உரிமையாளர் பங்கு மடங்கு" 
            value={data.ownerMultiplier} 
            onChange={(val) => handleInput('ownerMultiplier', val)} 
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex justify-center z-20 pb-safe">
          <button
            onClick={handleViewResults}
            className="w-full max-w-md mx-auto flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-500 focus:bg-pink-700 text-white p-5 rounded-2xl text-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-pink-900/30"
          >
            <span>View Results</span>
            <span className="text-pink-200">/</span>
            <span className="text-xl mt-1">முடிவுகள்</span>
            <ChevronRight className="w-8 h-8 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const { remainingProfit, crewShare, ownerShare } = calculateResults();

    const sendWhatsApp = () => {
      const now = new Date();
      const dateTimeString = now.toLocaleString('en-IN', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const message = `*Fishing Income Share / மீன்பிடி பங்கு*
📅 Date / தேதி: ${dateTimeString}
---------------------
Income / வருமானம்: ${parseFloat(data.totalIncome || '0').toFixed(2)}
Expenses / செலவுகள்: -${parseFloat(data.expenses || '0').toFixed(2)}
Profit / லாபம்: ${remainingProfit.toFixed(2)}
---------------------
Crew Count / குழு (எண்ணிக்கை): ${data.crewCount}
Crew Share / குழு பங்கு: ${crewShare.toFixed(2)}
Owner Share / உரிமையாளர்: ${ownerShare.toFixed(2)}`;

      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };

    return (
      <div className="pb-32 animate-in slide-in-from-right duration-300">
         <div className="flex items-center space-x-4 mb-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-4 border-b border-gray-800">
          <button onClick={() => setScreen('calc')} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors">
            <Calculator className="w-7 h-7" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">Final Shares</h2>
            <p className="text-pink-400 text-base font-medium mt-1">இறுதிப் பங்குகள்</p>
          </div>
        </div>

        <div className="space-y-5 px-1">
          <div className="bg-gray-800/80 p-6 rounded-3xl border border-gray-700 space-y-5 shadow-inner">
             <div className="flex justify-between items-center pb-5 border-b border-gray-700/60">
               <div>
                  <div className="text-gray-300 text-lg font-medium">Income / வருமானம்</div>
               </div>
               <div className="text-2xl font-bold text-white">{parseFloat(data.totalIncome || '0').toFixed(2)}</div>
             </div>
             
             <div className="flex justify-between items-center pb-5 border-b border-gray-700/60">
               <div>
                  <div className="text-gray-400 text-lg">Expenses / செலவுகள்</div>
               </div>
               <div className="text-2xl font-bold text-red-400">-{parseFloat(data.expenses || '0').toFixed(2)}</div>
             </div>

             <div className="flex justify-between items-center pt-2">
               <div>
                  <div className="text-gray-100 text-xl font-bold">Profit / லாபம்</div>
               </div>
               <div className="text-3xl font-black text-emerald-400">{remainingProfit.toFixed(2)}</div>
             </div>
          </div>

          <div className="bg-pink-900/20 p-6 rounded-3xl border border-pink-500/30 shadow-lg shadow-pink-900/10">
             <div className="text-center mb-8 mt-2">
                <div className="text-3xl font-black text-white px-2">Crew Member Share</div>
                <div className="text-pink-400 mt-2 mb-6 text-lg font-medium">ஒவ்வொரு குழு உறுப்பினரின் பங்கு</div>
                <div className="text-5xl font-black text-pink-500 bg-gray-900 py-6 rounded-2xl border border-pink-500/20 shadow-inner break-all px-4">
                  {crewShare.toFixed(2)}
                </div>
             </div>

              <div className="text-center mt-10 mb-4 pt-10 border-t border-pink-900/50">
                <div className="text-2xl font-bold text-white px-2">Owner Share</div>
                <div className="text-pink-400 mt-2 mb-4 text-base font-medium">உரிமையாளர் பங்கு</div>
                <div className="text-4xl font-black text-white bg-gray-900 py-5 rounded-2xl border border-gray-700 shadow-inner break-all px-4">
                  {ownerShare.toFixed(2)}
                </div>
             </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-3 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex justify-center z-20 pb-safe">
          <div className="w-full max-w-md mx-auto flex space-x-2 px-1">
            <button
              onClick={saveData}
              className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl transition-all border ${
                showSavedToast 
                  ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
                  : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'
              }`}
            >
              {showSavedToast ? <Check className="w-7 h-7 mb-1" /> : <Save className="w-7 h-7 mb-1 text-pink-500" />}
              <span className="text-sm font-bold whitespace-nowrap">{showSavedToast ? 'Saved!' : 'Save / சேமி'}</span>
            </button>
            
            <button
              onClick={sendWhatsApp}
              className="flex-1 flex flex-col items-center justify-center bg-green-900/30 hover:bg-green-900/50 text-green-400 px-1 py-3 rounded-2xl transition-colors border border-green-900/50"
            >
              <MessageCircle className="w-7 h-7 mb-1" />
              <span className="text-sm font-bold whitespace-nowrap">Share / பகிர்</span>
            </button>
            
            <button
              onClick={resetData}
              className="flex-1 flex flex-col items-center justify-center bg-red-900/20 hover:bg-red-900/40 text-red-400 p-3 rounded-2xl transition-colors border border-red-900/30"
            >
              <RotateCcw className="w-7 h-7 mb-1" />
              <span className="text-sm font-bold whitespace-nowrap">Clear / துடை</span>
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-pink-500/30">
      <div className="max-w-md mx-auto min-h-screen sm:min-h-[auto] sm:my-8 sm:rounded-[2.5rem] sm:border-8 border-gray-800 bg-gray-900 overflow-x-hidden relative sm:shadow-2xl sm:h-[850px] shadow-black">
         <div className="p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
            {screen === 'home' && renderHome()}
            {screen === 'calc' && renderCalc()}
            {screen === 'result' && renderResult()}
         </div>
      </div>
    </div>
  );
}
