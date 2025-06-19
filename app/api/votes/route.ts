import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sanitizeInput } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, rating, voterFingerprint } = body;

    // Validate input
    if (!questionId || !rating || !voterFingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating. Must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if question is still active
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('is_active')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (!question.is_active) {
      return NextResponse.json(
        { error: 'Voting is closed for this question' },
        { status: 400 }
      );
    }

    // Submit vote
    const { error } = await supabase
      .from('votes')
      .insert({
        question_id: questionId,
        rating,
        voter_fingerprint: sanitizeInput(voterFingerprint),
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You have already voted on this question' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json(
      { error: 'Unable to record vote. Please try again.' },
      { status: 500 }
    );
  }
}