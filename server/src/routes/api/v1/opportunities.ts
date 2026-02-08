import express from 'express';
import { OpportunitiesService } from '../../../services/opportunitiesService';

const router = express.Router();

// Get opportunities
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const lastId = req.query.lastId as string;

    const opportunities = await OpportunitiesService.getOpportunities(limit, lastId);
    res.json({ opportunities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// Get single opportunity
router.get('/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await OpportunitiesService.getOpportunityById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json({ opportunity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

// Save opportunity
router.post('/:opportunityId/save', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const savedId = await OpportunitiesService.saveOpportunity(userId, opportunityId, status, notes);
    res.json({ savedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save opportunity' });
  }
});

// Update saved opportunity status
router.put('/saved/:savedId', async (req, res) => {
  try {
    const { savedId } = req.params;
    const { status } = req.body;

    await OpportunitiesService.updateSavedOpportunityStatus(savedId, status);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get saved opportunities for user
router.get('/saved', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const saved = await OpportunitiesService.getSavedOpportunities(userId);
    res.json({ saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved opportunities' });
  }
});

export default router;