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
import { AngelNumberDetail } from './pages/AngelNumberDetail';
import { HowToRead } from './pages/HowToRead';
import { KarmicTail } from './pages/KarmicTail';
import { FamilyLines } from './pages/FamilyLines';
import { MoonPhase } from './pages/MoonPhase';
import { PythagoreanSquare } from './pages/PythagoreanSquare';
import { ZodiacCompatibility } from './pages/ZodiacCompatibility';
import { ZodiacPairDetail } from './pages/ZodiacPairDetail';
import { DailyArcana } from './pages/DailyArcana';
import { DailyHoroscope } from './pages/DailyHoroscope';
import { HoroscopeSignPage } from './pages/HoroscopeSign';
import { WeeklyHoroscope } from './pages/WeeklyHoroscope';
import { WeeklyHoroscopeSignPage } from './pages/WeeklyHoroscopeSign';
import { MonthlyHoroscope } from './pages/MonthlyHoroscope';
import { MonthlyHoroscopeSignPage } from './pages/MonthlyHoroscopeSign';
import { MoonCalendar2027 } from './pages/MoonCalendar2027';
import { MoonCalendarMonthPage } from './pages/MoonCalendarMonth';
import { Horoscope2027 } from './pages/Horoscope2027';
import { Horoscope2027SignPage } from './pages/Horoscope2027Sign';
import { ChineseZodiac } from './pages/ChineseZodiac';
import { ChineseZodiacAnimalPage } from './pages/ChineseZodiacAnimal';
import { ChineseZodiac2027 } from './pages/ChineseZodiac2027';
import { ChineseZodiac2027AnimalPage } from './pages/ChineseZodiac2027Animal';
import GaiaChat from './components/GaiaChat';

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
          <Route path="/tools/angel-numbers/:number" element={<AngelNumberDetail />} />
          <Route path="/tools/moon-phase" element={<MoonPhase />} />
          <Route path="/tools/pythagorean-square" element={<PythagoreanSquare />} />
          <Route path="/tools/zodiac-compatibility" element={<ZodiacCompatibility />} />
          <Route path="/tools/zodiac-compatibility/:pair" element={<ZodiacPairDetail />} />
          <Route path="/tools/daily-arcana" element={<DailyArcana />} />
          <Route path="/tools/daily-horoscope" element={<DailyHoroscope />} />
          <Route path="/tools/daily-horoscope/:sign" element={<HoroscopeSignPage />} />
          <Route path="/tools/weekly-horoscope" element={<WeeklyHoroscope />} />
          <Route path="/tools/weekly-horoscope/:sign" element={<WeeklyHoroscopeSignPage />} />
          <Route path="/tools/monthly-horoscope" element={<MonthlyHoroscope />} />
          <Route path="/tools/monthly-horoscope/:sign" element={<MonthlyHoroscopeSignPage />} />
          <Route path="/tools/moon-calendar-2027" element={<MoonCalendar2027 />} />
          <Route path="/tools/moon-calendar-2027/:month" element={<MoonCalendarMonthPage />} />
          <Route path="/tools/horoscope-2027" element={<Horoscope2027 />} />
          <Route path="/tools/horoscope-2027/:sign" element={<Horoscope2027SignPage />} />
          <Route path="/tools/chinese-zodiac" element={<ChineseZodiac />} />
          <Route path="/tools/chinese-zodiac/2027" element={<ChineseZodiac2027 />} />
          <Route path="/tools/chinese-zodiac/2027/:animal" element={<ChineseZodiac2027AnimalPage />} />
          <Route path="/tools/chinese-zodiac/:animal" element={<ChineseZodiacAnimalPage />} />
          <Route path="/tools/how-to-read-destiny-matrix" element={<HowToRead />} />
          <Route path="/tools/karmic-tail" element={<KarmicTail />} />
          <Route path="/tools/family-lines" element={<FamilyLines />} />

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
        <GaiaChat />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
