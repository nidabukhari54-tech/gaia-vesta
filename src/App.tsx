import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Chart } from './pages/Chart';
import { MyCharts } from './pages/MyCharts';
import { Settings } from './pages/Settings';
import { Pricing } from './pages/Pricing';
import { SharedChart } from './pages/SharedChart';
import { ToolsHub } from './pages/ToolsHub';
import { Compatibility } from './pages/Compatibility';
import { YearForecast } from './pages/YearForecast';
import { ChildMatrix } from './pages/ChildMatrix';
import { ArcanaIndex } from './pages/ArcanaIndex';
import { ArcanaDetail } from './pages/ArcanaDetail';
import { LifePath } from './pages/LifePath';
import { NameNumerology } from './pages/NameNumerology';
import { PersonalYear } from './pages/PersonalYear';
import { AngelNumbers } from './pages/AngelNumbers';
import { MoonPhase } from './pages/MoonPhase';
import { PythagoreanSquare } from './pages/PythagoreanSquare';
import { ZodiacCompatibility } from './pages/ZodiacCompatibility';
import { DailyArcana } from './pages/DailyArcana';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/share/:token" element={<SharedChart />} />

          {/* Public tools suite */}
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/tools/compatibility" element={<Compatibility />} />
          <Route path="/tools/year-forecast" element={<YearForecast />} />
          <Route path="/tools/child-matrix" element={<ChildMatrix />} />
          <Route path="/tools/life-path" element={<LifePath />} />
          <Route path="/tools/name-numerology" element={<NameNumerology />} />
          <Route path="/tools/personal-year" element={<PersonalYear />} />
          <Route path="/tools/angel-numbers" element={<AngelNumbers />} />
          <Route path="/tools/moon-phase" element={<MoonPhase />} />
          <Route path="/tools/pythagorean-square" element={<PythagoreanSquare />} />
          <Route path="/tools/zodiac-compatibility" element={<ZodiacCompatibility />} />
          <Route path="/tools/daily-arcana" element={<DailyArcana />} />

          {/* Arcana encyclopedia */}
          <Route path="/arcana" element={<ArcanaIndex />} />
          <Route path="/arcana/:id" element={<ArcanaDetail />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chart"
            element={
              <ProtectedRoute>
                <Chart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-charts"
            element={
              <ProtectedRoute>
                <MyCharts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
