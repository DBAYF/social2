import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase-admin/firestore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  uid: string;
  email: string;
  username: string;
  fullname: string;
  bio?: string;
  profilePicture?: string;
  website?: string;
  dateJoined: Date;
  followersCount: number;
  followingCount: number;
  isOnline: boolean;
}

export class AuthService {
  static async createUser(email: string, password: string, username: string, fullname: string) {
    try {
      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullname,
      });

      // Create user document in Firestore
      const userData: Omit<User, 'dateJoined'> = {
        uid: userRecord.uid,
        email,
        username,
        fullname,
        followersCount: 0,
        followingCount: 0,
        isOnline: true,
      };

      await setDoc(doc(db, 'users', userRecord.uid), {
        ...userData,
        dateJoined: new Date(),
      });

      return { uid: userRecord.uid, ...userData };
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  static async authenticateUser(email: string, password: string) {
    try {
      // For Firebase Auth, we'd use Firebase client SDK
      // This is a simplified version - in production use Firebase Auth
      const userDoc = await getDoc(doc(db, 'users', email));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const user = userDoc.data() as User;
      return user;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  static async getUserById(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error) {
      return null;
    }
  }

  static async updateUserProfile(uid: string, updates: Partial<User>) {
    try {
      await updateDoc(doc(db, 'users', uid), updates);
      return true;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }
}