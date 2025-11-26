import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const stmt = db.prepare(`
      SELECT blogs.*, users.name as author_name 
      FROM blogs 
      JOIN users ON blogs.author_id = users.id 
      WHERE blogs.id = ?
    `);
    const blog = stmt.get(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Check if blog belongs to user
    const checkStmt = db.prepare('SELECT author_id FROM blogs WHERE id = ?');
    const blog = checkStmt.get(id) as any;

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const stmt = db.prepare(
      'UPDATE blogs SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(title, content, id);

    return NextResponse.json(
      { message: 'Blog updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if blog belongs to user
    const checkStmt = db.prepare('SELECT author_id FROM blogs WHERE id = ?');
    const blog = checkStmt.get(id) as any;

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const stmt = db.prepare('DELETE FROM blogs WHERE id = ?');
    stmt.run(id);

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
