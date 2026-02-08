import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Stores
import { useAuthStore } from './stores';

// Components
import { Preloader } from './components/shared';
import ProtectedRoute from './routers/ProtectedRoute';
import PublicRoute from './routers/PublicRoute';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/home').then(m => ({ default: m.default })));
const LoginPage = lazy(() => import('./pages/login'));
const RegisterPage = lazy(() => import('./pages/register'));
const PostPage = lazy(() => import('./pages/post'));
const ProfilePage = lazy(() => import('./pages/profile'));
const SearchPage = lazy(() => import('./pages/search'));
const SuggestedPeoplePage = lazy(() => import('./pages/suggested_people'));
const ChatPage = lazy(() => import('./pages/chat'));
const NotFoundPage = lazy(() => import('./pages/error/PageNotFound'));

// Import routes from constants
import * as ROUTE from '~/constants/routes';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <Router>
      <Suspense fallback={<Preloader />}>
        <Routes>
          {/* Public routes */}
          <Route
            path={ROUTE.LOGIN}
            element={
              <PublicRoute isAuth={isAuthenticated}>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTE.REGISTER}
            element={
              <PublicRoute isAuth={isAuthenticated}>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path={ROUTE.HOME}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.POST}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <PostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.PROFILE}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.PROFILE_INFO}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.PROFILE_EDIT_INFO}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.PROFILE_FOLLOWERS}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.PROFILE_FOLLOWING}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.PROFILE_BOOKMARKS}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.SEARCH}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.SUGGESTED_PEOPLE}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <SuggestedPeoplePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.CHAT}
            element={
              <ProtectedRoute isAuth={isAuthenticated}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.SOCIAL_AUTH_FAILED}
            element={
              <PublicRoute isAuth={isAuthenticated}>
                <div>Social auth failed</div>
              </PublicRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;