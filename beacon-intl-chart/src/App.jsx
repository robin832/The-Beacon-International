import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// Opportunity configuration
const OPPORTUNITIES = {
  "Viva Tech Paris (June)": { short: "Viva Tech Paris", color: "#FF6B6B", flag: "🇫🇷" },
  "Smart City World Expo Barcelona (November)": { short: "Smart City Barcelona", color: "#4ECDC4", flag: "🇪🇸" },
  "Slush Helsinki (November)": { short: "Slush Helsinki", color: "#45B7D1", flag: "🇫🇮" },
  "Hannover Messe (April)": { short: "Hannover Messe", color: "#96CEB4", flag: "🇩🇪" },
  "Drone Summit Riga (May)": { short: "Drone Summit Riga", color: "#F9CA24", flag: "🇱🇻" },
  "Upstream Festival Rotterdam (May)": { short: "Upstream Rotterdam", color: "#A29BFE", flag: "🇳🇱" },
  "Possidonia Athens (June)": { short: "Possidonia Athens", color: "#00B894", flag: "🇬🇷" },
  "FIT Ports & Trade Mission Malaysia (September)": { short: "FIT Malaysia", color: "#E17055", flag: "🇲🇾" }
};

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [viewMode, setViewMode] = useState('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalResponses, setTotalResponses] = useState(0);
  const [showCompanies, setShowCompanies] = useState(true);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // Call your API route
      const response = await fetch('/api/survey-data');
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      const items = result.items || [];
      setTotalResponses(items.length);

      // Aggregate data
      const counts = {};
      Object.keys(OPPORTUNITIES).forEach(name => {
        counts[name] = { count: 0, companies: [] };
      });

      items.forEach(item => {
        const opportunities = item.opportunities || [];
        opportunities.forEach(opp => {
          const oppName = opp.trim();
          if (counts[oppName]) {
            counts[oppName].count++;
            if (item.consent && item.company) {
              counts[oppName].companies.push(item.company);
            }
          }
        });
      });

      // Convert to chart data
      const chartData = Object.entries(OPPORTUNITIES).map(([fullName, info]) => ({
        name: info.short,
        fullName: fullName,
        count: counts[fullName]?.count || 0,
        companies: counts[fullName]?.companies || [],
        color: info.color,
        flag: info.flag
      }));

      chartData.sort((a, b) => b.count - a.count);
      setData(chartData);
      setLastUpdated(new Date());
      setError(null);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{d.flag}</span>
            <p className="font-bold text-gray-800">{d.fullName}</p>
          </div>
          <p className="text-3xl font-bold mb-3" style={{ color: d.color }}>{d.count} interested</p>
          {showCompanies && d.companies.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-2">Companies interested:</p>
              <div className="flex flex-wrap gap-1">
                {d.companies.map((company, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-xl">Loading survey results...</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">The Beacon International</h1>
                <p className="text-blue-200/80">Live community interest • 2025 opportunities</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white font-semibold">{totalResponses} responses</span>
              </div>
              
              <button
                onClick={() => setShowCompanies(!showCompanies)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  showCompanies ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-gray-300'
                }`}
              >
                {showCompanies ? '👁️' : '🙈'} Companies
              </button>
              
              <div className="flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('bar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'bar' ? 'bg-white text-blue-900' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setViewMode('pie')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'pie' ? 'bg-white text-blue-900' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Pie
                </button>
              </div>

              <button
                onClick={fetchData}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50 shadow-lg"
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {lastUpdated && (
            <p className="text-xs text-blue-300/50 mt-4">
              Updated {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 15s
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20">
          {viewMode === 'bar' ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                >
                  <XAxis type="number" domain={[0, maxCount + 1]} stroke="#94a3b8" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={140}
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 12, 12, 0]} animationDuration={800}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.filter(d => d.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={60}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#94a3b8' }}
                  >
                    {data.filter(d => d.count > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item, idx) => (
            <div 
              key={item.fullName}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: item.color + '30' }}
                >
                  {item.flag}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white truncate pr-2">{item.fullName}</p>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</p>
                    </div>
                  </div>
                  
                  {showCompanies && item.companies.length > 0 && (
                    <div className="mt-3 flex items-start gap-2">
                      <span className="text-blue-300/50">🏢</span>
                      <p className="text-sm text-blue-200/70">
                        {item.companies.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {item.companies.length === 0 && item.count > 0 && (
                    <p className="text-sm text-blue-200/50 mt-2 italic">
                      {item.count} interested (companies not displayed)
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-300/50 text-sm">
          <p>Powered by The Beacon • Real-time data from Monday.com</p>
          <p className="mt-1">
            <a 
              href="https://forms.monday.com/forms/952d3df894af793199474c6caf6b4199" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Submit your interest →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
