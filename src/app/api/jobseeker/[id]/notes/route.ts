import { NextRequest, NextResponse } from 'next/server';
import pool from '@/utils/db';

interface Note {
  id: number;
  jobseeker_id: number;
  note: string;
  created_by: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

const mockUser = {
  id: 1,
  name: 'John Recruiter',
  role: 'Recruitment Executive'
};
 

// GET - Fetch all notes for a jobseeker
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const jobseekerId = parseInt(params.id);
    
    const [notes] = await pool.query(
      'SELECT * FROM jobseeker_notes WHERE jobseeker_id = ? ORDER BY created_at DESC',
      [jobseekerId]
    );

    return NextResponse.json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST - Add new note for a jobseeker
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const jobseekerId = parseInt(params.id);
    const body = await request.json();
    const { note } = body;

    // Validation
    if (!note || note.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Note must be at least 20 characters long' },
        { status: 400 }
      );
    }

    // Insert into database
    const [result] = await pool.query(
      'INSERT INTO jobseeker_notes (jobseeker_id, note, created_by) VALUES (?, ?, ?)',
      [jobseekerId, note.trim(), mockUser.name]
    );

    // Fetch the newly created note
    const [newNote]:any = await pool.query(
      'SELECT * FROM jobseeker_notes WHERE id = ?',
      [(result as any).insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'Note added successfully',
      data: newNote[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add note' },
      { status: 500 }
    );
  }
}

// PUT - Update existing note
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const jobseekerId = parseInt(params.id);
    const body = await request.json();
    const { noteId, note } = body;

    // Validation
    if (!note || note.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Note must be at least 20 characters long' },
        { status: 400 }
      );
    }

    // Update note in database
    const [result] = await pool.query(
      'UPDATE jobseeker_notes SET note = ? WHERE id = ? AND jobseeker_id = ?',
      [note.trim(), noteId, jobseekerId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Fetch updated note
    const [updatedNote] = await pool.query(
      'SELECT * FROM jobseeker_notes WHERE id = ?',
      [noteId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Note updated successfully',
      data: (updatedNote as any)[0]
    });

  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE - Delete note
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const url = new URL(request.url);
    const noteId = parseInt(url.searchParams.get('noteId') || '');
    const jobseekerId = parseInt(params.id);

    if (isNaN(noteId) || isNaN(jobseekerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid note ID or jobseeker ID' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'DELETE FROM jobseeker_notes WHERE id = ? AND jobseeker_id = ?',
      [noteId, jobseekerId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
