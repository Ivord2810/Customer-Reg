import React, { useState, useMemo } from 'react';
import { Customer, AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeCustomerData } from '../services/geminiService';
import { Sparkles, TrendingUp, Users, ShoppingBag, Loader, Award, MapPin, Clock } from 'lucide-react';

interface DashboardProps {
  customers: Customer[];
}

// Utility to calculate distance between two coords (Haversine formula)
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
};

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const totalBags = customers.reduce((acc, curr) => acc + curr.averageBags, 0);
  const avgBagsPerCustomer = customers.length > 0 ? Math.round(totalBags / customers.length) : 0;

  // Compute Segments
  const segments = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Assuming Factory HQ is at Accra Central for this demo
    const HQ_LAT = 5.6037;
    const HQ_LNG = -0.1870;

    return {
      highVolume: customers.filter(c => c.averageBags > 50).length,
      local: customers.filter(c => getDistanceFromLatLonInKm(c.latitude, c.longitude, HQ_LAT, HQ_LNG) <= 5).length,
      new: customers.filter(c => new Date(c.lastVisit) >= thirtyDaysAgo).length
    };
  }, [customers]);

  // Prepare data for chart - Top 5 customers by volume
  const chartData = [...customers]
    .sort((a, b) => b.averageBags - a.averageBags)
    .slice(0, 5)
    .map(c => ({
      name: c.businessName.length > 10 ? c.businessName.substring(0, 10) + '...' : c.businessName,
      bags: c.averageBags
    }));

  const runAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeCustomerData(customers);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-semibold">Total Customers</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{customers.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <ShoppingBag className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-semibold">Total Weekly Bags</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalBags.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-slate-800 transition-colors col-span-2 md:col-span-1">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <TrendingUp className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-semibold">Avg Bags / Client</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{avgBagsPerCustomer}</p>
        </div>
      </div>

      {/* Segments Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-1">Customer Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* High Volume Segment */}
          <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center text-emerald-700 dark:text-emerald-400 mb-1">
                <Award className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">High Volume</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{">"} 50 bags/week</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{segments.highVolume}</div>
            </div>
            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          {/* Local Retailers Segment */}
          <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-900 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center text-orange-700 dark:text-orange-400 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Local Retailers</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Within 5km (Accra)</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{segments.local}</div>
            </div>
            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          {/* New Customers Segment */}
          <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center text-purple-700 dark:text-purple-400 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">New Customers</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last 30 Days</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{segments.new}</div>
            </div>
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 h-64 transition-colors">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Top Customers by Volume</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
            <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                backgroundColor: '#1e293b', 
                color: '#f8fafc',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Bar dataKey="bags" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563EB' : '#60A5FA'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 dark:from-indigo-950 dark:to-slate-900 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Gemini AI Insights
            </h3>
            <p className="text-blue-200 text-sm mt-1">
              Analyze your distribution network for optimization.
            </p>
          </div>
          <button 
            onClick={runAnalysis}
            disabled={analyzing}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {analyzing ? <Loader className="w-4 h-4 animate-spin" /> : 'Analyze Data'}
          </button>
        </div>

        {analysis ? (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">Executive Summary</h4>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h4 className="text-xs font-bold text-green-300 uppercase tracking-wider mb-2">Strategy</h4>
              <p className="text-sm leading-relaxed">{analysis.strategy}</p>
            </div>
            {analysis.clusters.length > 0 && (
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Suggested Clusters</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {analysis.clusters.map((cluster, idx) => (
                    <li key={idx}>{cluster}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-blue-300/60 text-sm border-2 border-dashed border-blue-300/20 rounded-lg">
            Tap "Analyze Data" to unlock sales insights powered by Google Gemini.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;