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
    // Log connection attempt
    console.log('Attempting to connect to database...', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });

    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log('Successfully connected to database');

    try {
      // Test the connection with a simple query first
      await connection.query('SELECT 1');
      console.log('Database connection test successful');

      // Now fetch the actual data
      const [jobseekers] = await connection.query<Jobseeker[]>(
        'SELECT * FROM jobseekers ORDER BY created_at DESC'
      );
      console.log(`Successfully fetched ${jobseekers.length} jobseekers`);

      // Release the connection back to the pool
      connection.release();

      return NextResponse.json({
        success: true,
        data: jobseekers
      });
    } catch (queryError) {
      // Release the connection if query fails
      connection.release();
      throw queryError;
    }
  } catch (error) {
    console.error('Database error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error ? (error as any).code : undefined,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Database operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error ? (error as any).code : undefined
      },
      { status: 500 }
    );
  }
}
