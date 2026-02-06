import { z } from 'zod';
import { VENTURE_STAGES, PRIVACY_LEVELS } from '@/utils/constants';

export const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(50, 'Display name too long'),
  location: z.object({
    country: z.string().min(1, 'Country is required'),
    region: z.string().optional(),
    city: z.string().optional(),
  }),
  venture_name: z.string().min(1, 'Venture name is required').max(100, 'Venture name too long'),
  venture_stage: z.enum([...VENTURE_STAGES] as [string, ...string[]]),
  mission_short: z.string().min(10, 'Mission must be at least 10 characters').max(200, 'Mission too long'),
  description_long: z.string().max(2000, 'Description too long').optional(),
  tags: z.object({
    sectors: z.array(z.string()).min(1, 'Select at least one sector'),
    audiences: z.array(z.string()).optional(),
  }),
  seeking: z.object({
    funding: z.boolean(),
    mentor: z.boolean(),
    collaborator: z.boolean(),
  }),
  funding_needed_range: z.string().optional(),
  constraints: z.object({
    online_only: z.boolean().optional(),
    free_only: z.boolean().optional(),
    distance_km: z.number().optional(),
    exclusions: z.array(z.string()).optional(),
  }).optional(),
  privacy: z.enum([...PRIVACY_LEVELS] as [string, ...string[]]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
