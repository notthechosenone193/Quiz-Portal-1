import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import PreviewPage from './pages/PreviewPage';
import LiveQuizPage from './pages/LiveQuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TambolaSetupPage from './pages/TambolaSetupPage';
import TambolaHostPage from './pages/TambolaHostPage';
import TambolaGamePage from './pages/TambolaGamePage';
import QuizzesDetailPage from './pages/dashboard/QuizzesDetailPage';
import ParticipantsDetailPage from './pages/dashboard/ParticipantsDetailPage';
import TambolaGamesDetailPage from './pages/dashboard/TambolaGamesDetailPage';
import TambolaClaimsDetailPage from './pages/dashboard/TambolaClaimsDetailPage';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-8 max-w-md text-center space-y-4">
            <p className="text-4xl">⚠️</p>
            <h1 className="text-xl font-bold" style={{ color: '#4B286D' }}>Something went wrong</h1>
            <p className="text-sm" style={{ color: '#71757B' }}>{this.state.error?.message}</p>
            <button
              onClick={() => window.location.href = '/admin'}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: '#2B8000' }}
            >
              Return to Main Menu
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/create-quiz" element={<CreateQuizPage />} />
          <Route path="/admin/preview/:quizId" element={<PreviewPage />} />
          <Route path="/quiz/:quizId/:sessionCode" element={<LiveQuizPage />} />
          <Route path="/admin/results/:quizId" element={<ResultsPage />} />
          <Route path="/leaderboard/:quizId" element={<LeaderboardPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard/quizzes" element={<QuizzesDetailPage />} />
          <Route path="/admin/dashboard/participants" element={<ParticipantsDetailPage />} />
          <Route path="/admin/dashboard/tambola-games" element={<TambolaGamesDetailPage />} />
          <Route path="/admin/dashboard/tambola-claims" element={<TambolaClaimsDetailPage />} />
          <Route path="/admin/tambola" element={<TambolaSetupPage />} />
          <Route path="/admin/tambola/:gameId/host" element={<TambolaHostPage />} />
          <Route path="/tambola/:gameId/:sessionCode" element={<TambolaGamePage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
