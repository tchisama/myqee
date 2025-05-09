import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { subscriptionId, newStatus } = await request.json()

    // Validate input
    if (!subscriptionId || !newStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId and newStatus' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Update the subscription status
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()

    if (error) {
      console.error('Error updating subscription status:', error)
      return NextResponse.json(
        { error: 'Failed to update subscription status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `Subscription status updated to ${newStatus}`,
      data
    })
  } catch (error) {
    console.error('Unexpected error in update-status route:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
