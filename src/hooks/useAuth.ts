import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import {
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  resetPassword as firebaseResetPassword,
  onAuthChange,
} from '@/services/firebase/auth';
import { getDocument, subscribeToDocument } from '@/services/firebase/firestore';
import type { User, Profile } from '@/types';

export function useAuth() {
  const navigate = useNavigate();
  const {
    firebaseUser,
    user,
    profile,
    isLoading,
    isAuthenticated,
    isOnboarded,
    setFirebaseUser,
    setUser,
    setProfile,
    setLoading,
    reset,
  } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        // Fetch user data
        const userData = await getDocument<User>(`users/${fbUser.uid}`);
        setUser(userData);
        
        // Subscribe to profile updates
        const unsubProfile = subscribeToDocument<Profile>(
          `profiles/${fbUser.uid}`,
          (profileData) => {
            setProfile(profileData);
          }
        );
        
        return () => unsubProfile();
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUser, setProfile, setLoading]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignIn(email, password);
      addNotification({ type: 'success', title: 'Welcome back!' });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Sign in failed',
        message: error.message,
      });
      throw error;
    }
  }, [addNotification]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignUp(email, password);
      addNotification({ type: 'success', title: 'Account created!' });
      navigate('/onboarding');
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Sign up failed',
        message: error.message,
      });
      throw error;
    }
  }, [addNotification, navigate]);

  const signInWithGoogle = useCallback(async () => {
    try {
      await firebaseSignInWithGoogle();
      addNotification({ type: 'success', title: 'Welcome!' });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Sign in failed',
        message: error.message,
      });
      throw error;
    }
  }, [addNotification]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut();
      reset();
      navigate('/login');
      addNotification({ type: 'info', title: 'Signed out' });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Sign out failed',
        message: error.message,
      });
    }
  }, [addNotification, navigate, reset]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await firebaseResetPassword(email);
      addNotification({
        type: 'success',
        title: 'Password reset email sent',
        message: 'Check your inbox for instructions.',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Password reset failed',
        message: error.message,
      });
      throw error;
    }
  }, [addNotification]);

  return {
    user,
    profile,
    firebaseUser,
    isLoading,
    isAuthenticated,
    isOnboarded,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
