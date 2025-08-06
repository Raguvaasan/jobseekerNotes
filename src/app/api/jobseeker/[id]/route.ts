import { NextRequest, NextResponse } from 'next/server';
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

// GET - Fetch a single jobseeker
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const jobseekerId = parseInt(params.id);

    const [jobseekers] = await pool.query<Jobseeker[]>(
      'SELECT * FROM jobseekers WHERE id = ?',
      [jobseekerId]
    );

    if (!jobseekers || jobseekers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Jobseeker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jobseekers[0]
    });
  } catch (error) {
    console.error('Error fetching jobseeker:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobseeker' },
      { status: 500 }
    );
  }
}
