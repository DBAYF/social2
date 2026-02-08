import express from 'express';
import { PostService } from '../../../services/postService';
import { AuthService } from '../../../services/authService';

const router = express.Router();

// Get posts feed
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const lastPostId = req.query.lastPostId as string;

    const posts = await PostService.getPosts(limit, lastPostId);
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostService.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
router.post('/', async (req, res) => {
  try {
    const { content, images, isPublic } = req.body;
    const userId = req.user?.id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await AuthService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const author = {
      username: user.username,
      fullname: user.fullname,
      profilePicture: user.profilePicture,
    };

    const post = await PostService.createPost(userId, author, content, images, isPublic);
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like post
router.post('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await PostService.likePost(postId, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike post
router.delete('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await PostService.unlikePost(postId, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Add comment
router.post('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await AuthService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const author = {
      username: user.username,
      fullname: user.fullname,
      profilePicture: user.profilePicture,
    };

    const comment = await PostService.addComment(postId, userId, author, content);
    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const comments = await PostService.getComments(postId, limit);
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

export default router;