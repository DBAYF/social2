import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoadingState } from '@/components/shared/LoadingState';

// Lazy load pages to reduce initial bundle size
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('@/pages/auth/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const OnboardingLayout = React.lazy(() => import('@/pages/onboarding/OnboardingLayout').then(m => ({ default: m.OnboardingLayout })));
const Step1BasicInfo = React.lazy(() => import('@/pages/onboarding/Step1BasicInfo').then(m => ({ default: m.Step1BasicInfo })));
const Step2VentureDetails = React.lazy(() => import('@/pages/onboarding/Step2VentureDetails').then(m => ({ default: m.Step2VentureDetails })));
const Step3FocusAreas = React.lazy(() => import('@/pages/onboarding/Step3FocusAreas').then(m => ({ default: m.Step3FocusAreas })));
const Step4Goals = React.lazy(() => import('@/pages/onboarding/Step4Goals').then(m => ({ default: m.Step4Goals })));
const HomePage = React.lazy(() => import('@/pages/main/HomePage').then(m => ({ default: m.HomePage })));
const FeedPage = React.lazy(() => import('@/pages/main/FeedPage').then(m => ({ default: m.FeedPage })));
const MessagesPage = React.lazy(() => import('@/pages/main/MessagesPage').then(m => ({ default: m.MessagesPage })));
const ThreadPage = React.lazy(() => import('@/pages/main/ThreadPage').then(m => ({ default: m.ThreadPage })));
const OpportunitiesPage = React.lazy(() => import('@/pages/main/OpportunitiesPage').then(m => ({ default: m.OpportunitiesPage })));
const MentorsPage = React.lazy(() => import('@/pages/main/MentorsPage').then(m => ({ default: m.MentorsPage })));
const ProfilePage = React.lazy(() => import('@/pages/main/ProfilePage').then(m => ({ default: m.ProfilePage })));
const EditProfilePage = React.lazy(() => import('@/pages/main/EditProfilePage').then(m => ({ default: m.EditProfilePage })));
const UserProfilePage = React.lazy(() => import('@/pages/main/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const SettingsPage = React.lazy(() => import('@/pages/main/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = React.lazy(() => import('@/pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminReports = React.lazy(() => import('@/pages/admin/AdminReports').then(m => ({ default: m.AdminReports })));
const AdminOpportunities = React.lazy(() => import('@/pages/admin/AdminOpportunities').then(m => ({ default: m.AdminOpportunities })));
const AdminAuditLog = React.lazy(() => import('@/pages/admin/AdminAuditLog').then(m => ({ default: m.AdminAuditLog })));
const NotFoundPage = React.lazy(() => import('@/pages/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ErrorPage = React.lazy(() => import('@/pages/errors/ErrorPage').then(m => ({ default: m.ErrorPage })));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingState />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: '/signup', element: <SuspenseWrapper><SignupPage /></SuspenseWrapper> },
      { path: '/forgot-password', element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute requireOnboarded={false}>
        <SuspenseWrapper><OnboardingLayout /></SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="step-1" replace /> },
      { path: 'step-1', element: <SuspenseWrapper><Step1BasicInfo /></SuspenseWrapper> },
      { path: 'step-2', element: <SuspenseWrapper><Step2VentureDetails /></SuspenseWrapper> },
      { path: 'step-3', element: <SuspenseWrapper><Step3FocusAreas /></SuspenseWrapper> },
      { path: 'step-4', element: <SuspenseWrapper><Step4Goals /></SuspenseWrapper> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: '/home', element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      { path: '/feed', element: <SuspenseWrapper><FeedPage /></SuspenseWrapper> },
      { path: '/messages', element: <SuspenseWrapper><MessagesPage /></SuspenseWrapper> },
      { path: '/messages/:threadId', element: <SuspenseWrapper><ThreadPage /></SuspenseWrapper> },
      { path: '/opportunities', element: <SuspenseWrapper><OpportunitiesPage /></SuspenseWrapper> },
      { path: '/mentors', element: <SuspenseWrapper><MentorsPage /></SuspenseWrapper> },
      { path: '/profile', element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
      { path: '/profile/edit', element: <SuspenseWrapper><EditProfilePage /></SuspenseWrapper> },
      { path: '/profile/:uid', element: <SuspenseWrapper><UserProfilePage /></SuspenseWrapper> },
      { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
      { path: 'users', element: <SuspenseWrapper><AdminUsers /></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><AdminReports /></SuspenseWrapper> },
      { path: 'opportunities', element: <SuspenseWrapper><AdminOpportunities /></SuspenseWrapper> },
      { path: 'audit', element: <SuspenseWrapper><AdminAuditLog /></SuspenseWrapper> },
    ],
  },
  { path: '*', element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
]);
