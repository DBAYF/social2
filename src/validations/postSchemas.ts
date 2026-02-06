import { z } from 'zod';
import { POST_TYPES, PRIVACY_LEVELS } from '@/utils/constants';

export const postSchema = z.object({
  type: z.enum([...POST_TYPES] as [string, ...string[]]),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content too long'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  visibility: z.enum([...PRIVACY_LEVELS] as [string, ...string[]]),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
});

export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
