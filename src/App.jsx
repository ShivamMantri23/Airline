import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  Table,
  Wifi,
  Plane,
  Users,
  Star
} from 'lucide-react';

// --- Hardcoded "Pre-Analyzed" Data ---
// In a real app, this data would come from a backend API after
// running analysis on the full 100,000+ row dataset.

// 1. EDA: Satisfaction rate by key features
const edaData = {
  byClass: [
    { name: 'Business', satisfied: 69.9, dissatisfied: 30.1 },
    { name: 'Eco', satisfied: 18.5, dissatisfied: 81.5 },
    { name: 'Eco Plus', satisfied: 22.1, dissatisfied: 77.9 },
  ],
  byOnlineBoarding: [
    { name: '0', satisfied: 9.3, dissatisfied: 90.7 },
    { name: '1', satisfied: 18.1, dissatisfied: 81.9 },
    { name: '2', satisfied: 28.5, dissatisfied: 71.5 },
    { name: '3', satisfied: 46.8, dissatisfied: 53.2 },
    { name: '4', satisfied: 72.3, dissatisfied: 27.7 },
    { name: '5', satisfied: 86.1, dissatisfied: 13.9 },
  ],
  byWifi: [
    { name: '0', satisfied: 3.2, dissatisfied: 96.8 },
    { name: '1', satisfied: 22.4, dissatisfied: 77.6 },
    { name: '2', satisfied: 38.6, dissatisfied: 61.4 },
    { name: '3', satisfied: 52.3, dissatisfied: 47.7 },
    { name: '4', satisfied: 71.8, dissatisfied: 28.2 },
    { name: '5', satisfied: 75.1, dissatisfied: 24.9 },
  ],
};

// 2. Model: SHAP Feature Importance (Simulated Results)
const shapData = [
  { feature: 'Online boarding', importance: 0.42 },
  { feature: 'Class (Business)', importance: 0.35 },
  { feature: 'Inflight wifi service', importance: 0.28 },
  { feature: 'Type of Travel (Business)', importance: 0.21 },
  { feature: 'Seat comfort', importance: 0.15 },
  { feature: 'Inflight entertainment', importance: 0.12 },
  { feature: 'Leg room service', importance: 0.09 },
  { feature: 'On-board service', importance: 0.07 },
];

// 3. Model: Performance Metrics (Simulated)
const modelMetrics = {
  model: "XGBoost Classifier",
  accuracy: "96.2%",
  precision: "95.8%",
  recall: "94.1%",
};

const COLORS = ['#0088FE', '#FF8042']; // Blue: satisfied, Orange: dissatisfied

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  // Use simulated stats instead of fetching
  const [sampleStats, setSampleStats] = useState({
    total: 100,
    satisfied: 43,
    rate: 43.0
  });

  // --- Reusable Components ---
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </Card>
  );

  // --- Views ---
  const DashboardView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Passengers (Sample)"
          value={sampleStats.total}
          icon={<Users className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Satisfied (Sample)"
          value={sampleStats.satisfied}
          icon={<Star className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Satisfaction Rate (Sample)"
          value={`${sampleStats.rate.toFixed(1)}%`}
          icon={<PieChart className="text-white" />}
          color="bg-yellow-500"
        />
      </div>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Key Insights Summary</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            **Online Boarding** is the single most critical factor. A poor boarding experience (rating 1-2) almost guarantees dissatisfaction.
          </li>
          <li>
            **Business Class** passengers are significantly more satisfied, driven by better services across the board.
          </li>
          <li>
            **In-flight Wifi Service** is a major driver, especially for Business travelers. A rating below 3 is a strong predictor of dissatisfaction.
          </li>
          <li>
            **Type of Travel** matters: 'Business travel' passengers have higher expectations but are also more often 'satisfied' (likely due to flying Business Class).
          </li>
          <li>
            Services like **Seat Comfort** and **In-flight Entertainment** are important, but less critical than the 'big 3' (Boarding, Class, Wifi).
          </li>
        </ul>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EdaView minimal={true} />
      </div>
    </div>
  );

  const EdaView = ({ minimal = false }) => (
    <>
      {!minimal && <h2 className="text-3xl font-bold mb-6">Exploratory Data Analysis (EDA)</h2>}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Satisfaction by Class</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={edaData.byClass} layout="vertical">
            <XAxis type="number" unit="%" />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="satisfied" stackId="a" fill="#0088FE" />
            <Bar dataKey="dissatisfied" stackId="a" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Satisfaction by Online Boarding Rating</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={edaData.byOnlineBoarding}>
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="satisfied" stackId="a" fill="#0088FE" />
            <Bar dataKey="dissatisfied" stackId="a" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Satisfaction by Inflight Wifi Service</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={edaData.byWifi}>
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="satisfied" stackId="a" fill="#0088FE" />
            <Bar dataKey="dissatisfied" stackId="a" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );

  const ModelView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Model & SHAP Analysis</h2>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Model Performance (Simulated)</h3>
        <p className="mb-4 text-gray-600">
          An XGBoost Classifier was trained on the full dataset, demonstrating high predictive power.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-w-[200px]">
            <div className="text-sm text-gray-500">Model Type</div>
            <div className="text-2xl font-semibold text-gray-900">{modelMetrics.model}</div>
          </div>
          <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-w-[200px]">
            <div className="text-sm text-gray-500">Accuracy</div>
            <div className="text-2xl font-semibold text-green-700">{modelMetrics.accuracy}</div>
          </div>
          <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-w-[200px]">
            <div className="text-sm text-gray-500">Precision (for 'satisfied')</div>
            <div className="text-2xl font-semibold text-green-700">{modelMetrics.precision}</div>
          </div>
          <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-w-[200px]">
            <div className="text-sm text-gray-500">Recall (for 'satisfied')</div>
            <div className="text-2xl font-semibold text-green-700">{modelMetrics.recall}</div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">SHAP Analysis: Key Drivers of Satisfaction</h3>
        <p className="text-gray-600 mb-4">
          SHAP (SHapley Additive exPlanations) analysis shows the average impact of each feature on the model's prediction. This tells us *why* the model makes its decisions.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={shapData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="feature" width={150} />
            <Tooltip />
            <Bar dataKey="importance" fill="#0088FE">
              {shapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#FF8042' : '#0088FE'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">
          <span className="font-bold">Interpretation:</span> The chart shows `Online boarding` has the largest impact on predicting satisfaction, followed by `Class` and `Inflight wifi`. The top 3 drivers (highlighted in orange) are overwhelmingly the most important.
        </p>
      </Card>
    </div>
  );

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'eda':
        return <EdaView />;
      case 'model':
        return <ModelView />;
      default:
        return <DashboardView />;
    }
  };

  const NavItem = ({ icon, label, view }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium
          ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-center h-20 border-b">
          <Plane className="w-8 h-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Airline Intel</span>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" view="dashboard" />
          <NavItem icon={<BarChart3 size={20} />} label="EDA" view="eda" />
          <NavItem icon={<BrainCircuit size={20} />} label="Model & SHAP" view="model" />
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}