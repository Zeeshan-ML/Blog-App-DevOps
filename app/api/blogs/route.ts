import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT blogs.*, users.name as author_name 
      FROM blogs 
      JOIN users ON blogs.author_id = users.id 
      ORDER BY blogs.created_at DESC
    `);
    const blogs = stmt.all();

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      'INSERT INTO blogs (title, content, author_id) VALUES (?, ?, ?)'
    );
    const result = stmt.run(title, content, user.id);

    return NextResponse.json(
      { message: 'Blog created successfully', blogId: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
