import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from 'firebase-admin/firestore';

interface Post {
  id: string;
  authorId: string;
  author: {
    username: string;
    fullname: string;
    profilePicture?: string;
    ventureName?: string;
    ventureStage?: string;
    tags?: string[];
  };
  content: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt?: Date;
  isPublic: boolean;
  type?: 'intro' | 'update' | 'ask' | 'opportunity';
  tags?: string[];
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    username: string;
    fullname: string;
    profilePicture?: string;
  };
  content: string;
  createdAt: Date;
}

export class PostService {
  static async createPost(
    authorId: string,
    author: any,
    content: string,
    images?: string[],
    isPublic = true,
    type?: 'intro' | 'update' | 'ask' | 'opportunity',
    tags?: string[]
  ) {
    try {
      const postRef = doc(collection(db, 'posts'));
      const postData: Omit<Post, 'id'> = {
        authorId,
        author,
        content,
        images,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date(),
        isPublic,
        type,
        tags,
      };

      await setDoc(postRef, postData);
      return { id: postRef.id, ...postData };
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }

  static async getPosts(limitCount = 20, lastPostId?: string) {
    try {
      let q = query(
        collection(db, 'posts'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastPostId) {
        const lastDoc = await getDoc(doc(db, 'posts', lastPostId));
        if (lastDoc.exists) {
          q = query(q, startAfter(lastDoc));
        }
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (error) {
      throw new Error('Failed to fetch posts');
    }
  }

  static async getPostById(postId: string): Promise<Post | null> {
    try {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (!postDoc.exists()) return null;

      return { id: postDoc.id, ...postDoc.data() } as Post;
    } catch (error) {
      return null;
    }
  }

  static async likePost(postId: string, userId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data() as Post;
      const newLikesCount = post.likesCount + 1;

      await updateDoc(postRef, {
        likesCount: newLikesCount,
        updatedAt: new Date(),
      });

      return { likesCount: newLikesCount };
    } catch (error) {
      throw new Error('Failed to like post');
    }
  }

  static async unlikePost(postId: string, userId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data() as Post;
      const newLikesCount = Math.max(0, post.likesCount - 1);

      await updateDoc(postRef, {
        likesCount: newLikesCount,
        updatedAt: new Date(),
      });

      return { likesCount: newLikesCount };
    } catch (error) {
      throw new Error('Failed to unlike post');
    }
  }

  static async addComment(postId: string, authorId: string, author: any, content: string) {
    try {
      // Add comment
      const commentRef = doc(collection(db, 'comments'));
      const commentData: Omit<Comment, 'id'> = {
        postId,
        authorId,
        author,
        content,
        createdAt: new Date(),
      };

      await setDoc(commentRef, commentData);

      // Update post comment count
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const post = postDoc.data() as Post;
        await updateDoc(postRef, {
          commentsCount: post.commentsCount + 1,
          updatedAt: new Date(),
        });
      }

      return { id: commentRef.id, ...commentData };
    } catch (error) {
      throw new Error('Failed to add comment');
    }
  }

  static async getComments(postId: string, limitCount = 10) {
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
    } catch (error) {
      throw new Error('Failed to fetch comments');
    }
  }
}