import { NextResponse } from 'next/server';
import pool from '@/utils/db';
import { RowDataPacket } from 'mysql2';

interface Jobseeker extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience_years: number;
  skills: string;
  status: string;
  created_at: string;
}

// GET - Fetch all jobseekers
export async function GET() {
  try {
    // Test database connection first
    await pool.getConnection();
    
    const [jobseekers] = await pool.query<Jobseeker[]>(
      'SELECT * FROM jobseekers ORDER BY created_at DESC'
    );

    return NextResponse.json({
      success: true,
      data: jobseekers
    });
  } catch (error) {
    console.error('Error fetching jobseekers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed. Please check your database configuration.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
