import { useState } from 'react';
import Header from './components/Header';
import CompensationCalculator from './components/CompensationCalculator';
import InfoSection from './components/InfoSection';
import SavedCalculations from './components/SavedCalculations';

export interface Calculation {
  id?: string;
  sale_price: number;
  commission_rate: number;
  buyer_agent_split: number;
  seller_concession: number;
  buyer_credit: number;
  total_compensation: number;
  notes: string;
  created_at?: string;
}

function App() {
  const [savedCalculations, setSavedCalculations] = useState<Calculation[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CompensationCalculator onSaved={handleSaved} />
            <InfoSection />
          </div>
          <div className="lg:col-span-1">
            <SavedCalculations
              calculations={savedCalculations}
              onLoad={setSavedCalculations}
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
