import express from 'express';
import { RecommendationsService } from '../../../services/recommendationsService';

const router = express.Router();

// Get recommendations for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    const targetType = req.query.type as string;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const recommendations = await RecommendationsService.getRecommendationsForUser(
      userId,
      targetType as any,
      limit
    );
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Submit feedback on recommendation
router.post('/:recommendationId/feedback', async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { feedback } = req.body;

    if (!['accepted', 'dismissed'].includes(feedback)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }

    await RecommendationsService.submitFeedback(recommendationId, feedback);
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Generate new recommendations (admin/debug endpoint)
router.post('/generate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const recommendations = await RecommendationsService.generateRecommendations(userId);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;