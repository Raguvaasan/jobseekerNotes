import express from 'express';
import { db } from '../server';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all notes for a jobseeker
router.get('/:id/notes', authenticateToken, async (req, res) => {
  try {
    const jobseekerId = req.params.id;
    
    const [rows] = await db.execute(
      `SELECT jn.*, u.name as created_by_name 
       FROM jobseeker_notes jn 
       LEFT JOIN users u ON jn.created_by = u.id 
       WHERE jn.jobseeker_id = ? 
       ORDER BY jn.created_at DESC`,
      [jobseekerId]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes'
    });
  }
});

// Add new note for a jobseeker
router.post('/:id/notes', authenticateToken, requireRole(['Recruitment Executive', 'Manager', 'Admin']), async (req, res) => {
  try {
    const jobseekerId = req.params.id;
    const { note } = req.body;
    const userId = (req as any).user.id;

    // Validation
    if (!note || note.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Note must be at least 20 characters long'
      });
    }

    const [result] = await db.execute(
      `INSERT INTO jobseeker_notes (jobseeker_id, note, created_by, created_at) 
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [jobseekerId, note.trim(), userId]
    );

    // Fetch the created note with user info
    const [noteData] = await db.execute(
      `SELECT jn.*, u.name as created_by_name 
       FROM jobseeker_notes jn 
       LEFT JOIN users u ON jn.created_by = u.id 
       WHERE jn.id = ?`,
      [(result as any).insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: (noteData as any)[0]
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note'
    });
  }
});

// Update existing note
router.put('/:jobseekerId/notes/:noteId', authenticateToken, requireRole(['Recruitment Executive', 'Manager', 'Admin']), async (req, res) => {
  try {
    const { jobseekerId, noteId } = req.params;
    const { note } = req.body;
    const userId = (req as any).user.id;

    // Validation
    if (!note || note.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Note must be at least 20 characters long'
      });
    }

    // Check if note exists and user has permission to edit
    const [existingNote] = await db.execute(
      'SELECT * FROM jobseeker_notes WHERE id = ? AND jobseeker_id = ?',
      [noteId, jobseekerId]
    );

    if ((existingNote as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    await db.execute(
      'UPDATE jobseeker_notes SET note = ? WHERE id = ? AND jobseeker_id = ?',
      [note.trim(), noteId, jobseekerId]
    );

    // Fetch updated note
    const [updatedNote] = await db.execute(
      `SELECT jn.*, u.name as created_by_name 
       FROM jobseeker_notes jn 
       LEFT JOIN users u ON jn.created_by = u.id 
       WHERE jn.id = ?`,
      [noteId]
    );

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: (updatedNote as any)[0]
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update note'
    });
  }
});

// Delete note
router.delete('/:jobseekerId/notes/:noteId', authenticateToken, requireRole(['Recruitment Executive', 'Manager', 'Admin']), async (req, res) => {
  try {
    const { jobseekerId, noteId } = req.params;

    // Check if note exists
    const [existingNote] = await db.execute(
      'SELECT * FROM jobseeker_notes WHERE id = ? AND jobseeker_id = ?',
      [noteId, jobseekerId]
    );

    if ((existingNote as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    await db.execute(
      'DELETE FROM jobseeker_notes WHERE id = ? AND jobseeker_id = ?',
      [noteId, jobseekerId]
    );

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete note'
    });
  }
});

export default router;
