import { resumeService } from '../../../services/resumeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resumeId } = req.body;
    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    await resumeService.handleResumeCompletion(resumeId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling resume completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 