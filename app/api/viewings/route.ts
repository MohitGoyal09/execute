import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/viewings - Get viewings for the current user
export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get user role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
  
  let query = supabase
    .from('property_viewings')
    .select(`
      *,
      properties(id, title, address, city, state, zip_code),
      profiles!property_viewings_tenant_id_fkey(id, full_name)
    `)
  
  // Filter based on user role
  if (profile.role === 'tenant') {
    query = query.eq('tenant_id', user.id)
  } else if (profile.role === 'landlord') {
    query = query.eq('properties.landlord_id', user.id)
  }
  
  const { data: viewings, error } = await query.order('viewing_date', { ascending: true })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ viewings })
}

// POST /api/viewings - Create a new viewing request
export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user is a tenant
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
  
  if (profile.role !== 'tenant') {
    return NextResponse.json({ error: 'Only tenants can request viewings' }, { status: 403 })
  }
  
  try {
    const viewingData = await request.json()
    
    // Validate required fields
    if (!viewingData.property_id || !viewingData.viewing_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, landlord_id, status')
      .eq('id', viewingData.property_id)
      .single()
    
    if (propertyError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    
    if (property.status !== 'available') {
      return NextResponse.json({ error: 'Property is not available for viewing' }, { status: 400 })
    }
    
    // Add tenant_id to viewing data
    viewingData.tenant_id = user.id
    
    // Insert viewing request
    const { data: viewing, error } = await supabase
      .from('property_viewings')
      .insert(viewingData)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Create notification for landlord
    await supabase
      .from('notifications')
      .insert({
        user_id: property.landlord_id,
        title: 'New Viewing Request',
        message: `A tenant has requested to view your property on ${new Date(viewingData.viewing_date).toLocaleDateString()}`,
        link: `/dashboard/viewings/${viewing.id}`
      })
    
    return NextResponse.json({ viewing }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
} 