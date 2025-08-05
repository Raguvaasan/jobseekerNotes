# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Jobseeker Profile application with "Add Note" functionality. The project includes:

### Tech Stack
- **Frontend**: Next.js with TypeScript, Tailwind CSS, and styled-components
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Features**: Jobseeker profile management with note-taking functionality

### Key Features
1. Jobseeker Profile Page with Notes tab/section
2. Add new notes with textarea input (min 20 characters, required)
3. Save Note button functionality
4. Display existing notes with date & user information
5. Optional Edit/Delete functionality with confirmation modal
6. API submission to /api/jobseeker/id/notes endpoint

### Access Control
- Only users with role = Recruitment Executive or higher can add/edit/delete notes
- Log user_id in created_by for traceability

### Coding Guidelines
- Use TypeScript for all new files
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling
- Implement proper error handling and validation
- Use async/await for API calls
- Follow RESTful API conventions
