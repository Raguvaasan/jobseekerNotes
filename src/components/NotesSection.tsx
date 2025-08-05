'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Note {
  id: number;
  jobseeker_id: number;
  note: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

interface NotesSectionProps {
  jobseekerId: number;
}

export default function NotesSection({ jobseekerId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Mock user - in real app, this would come from authentication
  const currentUser = {
    id: 1,
    role: 'Recruitment Executive',
    name: 'John Recruiter'
  };

  useEffect(() => {
    fetchNotes();
  }, [jobseekerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobseeker/${jobseekerId}/notes`);
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.data);
      } else {
        setError('Failed to load notes');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes');
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (newNote.trim().length < 20) {
      setError('Note must be at least 20 characters long');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/api/jobseeker/${jobseekerId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: newNote.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setNotes(prev => [data.data, ...prev]);
        setNewNote('');
      } else {
        setError(data.error || 'Failed to save note');
      }
      setSaving(false);

    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note');
      setSaving(false);
    }
  };

  const handleEditNote = async (noteId: number) => {
    if (editText.trim().length < 20) {
      setError('Note must be at least 20 characters long');
      return;
    }

    try {
      setError('');
      
      const response = await fetch(`/api/jobseeker/${jobseekerId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, note: editText.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setNotes(prev => prev.map(note => 
          note.id === noteId 
            ? { ...note, note: editText.trim() }
            : note
        ));
        setEditingNote(null);
        setEditText('');
      } else {
        setError(data.error || 'Failed to update note');
      }

    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`/api/jobseeker/${jobseekerId}/notes?noteId=${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        setShowDeleteModal(null);
      } else {
        setError(data.error || 'Failed to delete note');
      }

    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditText(note.note);
    setError('');
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditText('');
    setError('');
  };

  const canEditNotes = ['Recruitment Executive', 'Manager', 'Admin'].includes(currentUser.role);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Access Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-amber-600 rounded-full p-1 mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">
              Current Role: <span className="font-semibold">{currentUser.role}</span>
            </p>
            <p className="text-xs text-amber-700 mt-1">
              {canEditNotes 
                ? "✓ You can add, edit, and delete notes" 
                : "❌ Only Recruitment Executives and higher can manage notes"}
            </p>
          </div>
        </div>
      </div>

      {/* Add New Note */}
      {canEditNotes && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Add New Note</h3>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Note (minimum 20 characters) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="note"
                rows={4}
                value={newNote}
                onChange={(e) => {
                  setNewNote(e.target.value);
                  if (error) setError('');
                }}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-900 bg-white font-medium text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors shadow-sm"
                placeholder="Enter your note here... (minimum 20 characters required)"
                style={{ minHeight: '120px' }}
                required
              />
              <p className="text-sm mt-2 flex justify-between items-center">
                <span className={`font-medium ${newNote.length < 20 ? 'text-red-500' : 'text-green-600'}`}>
                  {newNote.length}/20 characters minimum
                </span>
                {newNote.length >= 20 && (
                  <span className="text-green-600 text-xs font-medium">✓ Ready to save</span>
                )}
              </p>
            </div>
            
            <button
              onClick={handleSaveNote}
              disabled={saving || newNote.trim().length < 20}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Note'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Existing Notes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-gray-600 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Track History
            </h3>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </div>
        </div>
        
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notes found for this jobseeker.</p>
            {canEditNotes && (
              <p className="text-sm mt-2">Be the first to add a note above.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={note.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {note.created_by_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{note.created_by_name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>#{notes.length - index}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{new Date(note.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                  
                  {canEditNotes && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(note.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingNote === note.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                        if (error) setError('');
                      }}
                      rows={4}
                      className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-900 bg-white font-medium text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors shadow-sm"
                      style={{ minHeight: '120px' }}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(note.id)}
                        disabled={editText.trim().length < 20}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium text-base">
                      {note.note}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {note.note.length} characters
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Saved
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(showDeleteModal)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
