import { z } from 'zod';
import { SAVED_STATUSES } from '@/utils/constants';

export const savedOpportunityStatusSchema = z.object({
  status: z.enum([...SAVED_STATUSES] as [string, ...string[]]),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

export type SavedOpportunityStatusInput = z.infer<typeof savedOpportunityStatusSchema>;
