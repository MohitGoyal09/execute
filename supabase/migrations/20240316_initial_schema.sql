-- Create users table extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create custom types
CREATE TYPE user_role AS ENUM ('tenant', 'landlord');
CREATE TYPE property_status AS ENUM ('available', 'rented', 'maintenance', 'inactive');
CREATE TYPE viewing_status AS ENUM (
    'requested',
    'confirmed',
    'completed',
    'cancelled'
);
CREATE TYPE negotiation_status AS ENUM ('active', 'accepted', 'rejected', 'expired');
CREATE TYPE agreement_status AS ENUM (
    'draft',
    'pending_review',
    'pending_signature',
    'signed',
    'expired',
    'terminated'
);
-- Create profiles table (extends Supabase auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    date_of_birth DATE,
    profile_image_url TEXT,
    identity_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(3, 1) NOT NULL,
    area_sqft INTEGER NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL,
    available_from DATE NOT NULL,
    min_lease_duration INTEGER NOT NULL,
    status property_status DEFAULT 'available',
    amenities JSONB DEFAULT '{}',
    accessibility_features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create property_images table
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create property_viewings table
CREATE TABLE property_viewings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    viewing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status viewing_status DEFAULT 'requested',
    is_virtual BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, property_id)
);
-- Create negotiations table
CREATE TABLE negotiations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    proposed_rent DECIMAL(10, 2),
    proposed_deposit DECIMAL(10, 2),
    proposed_move_in_date DATE,
    proposed_lease_duration INTEGER,
    special_terms TEXT,
    status negotiation_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create messages table for negotiation chat
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    negotiation_id UUID NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create rental_agreements table
CREATE TABLE rental_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    negotiation_id UUID REFERENCES negotiations(id),
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL,
    payment_due_day INTEGER NOT NULL,
    special_terms TEXT,
    ai_verified BOOLEAN DEFAULT FALSE,
    status agreement_status DEFAULT 'draft',
    tenant_signed BOOLEAN DEFAULT FALSE,
    tenant_signed_at TIMESTAMP WITH TIME ZONE,
    landlord_signed BOOLEAN DEFAULT FALSE,
    landlord_signed_at TIMESTAMP WITH TIME ZONE,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create agreement_versions table for tracking changes
CREATE TABLE agreement_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID NOT NULL REFERENCES rental_agreements(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agreement_id, version_number)
);
-- Create agreement_comments table
CREATE TABLE agreement_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID NOT NULL REFERENCES rental_agreements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- Create profile policies
CREATE POLICY "Users can view their own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
-- Create property policies
CREATE POLICY "Anyone can view available properties" ON properties FOR
SELECT USING (
        status = 'available'
        OR landlord_id = auth.uid()
    );
CREATE POLICY "Landlords can insert their own properties" ON properties FOR
INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords can update their own properties" ON properties FOR
UPDATE USING (landlord_id = auth.uid());
CREATE POLICY "Landlords can delete their own properties" ON properties FOR DELETE USING (landlord_id = auth.uid());
-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_profiles_modtime BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_properties_modtime BEFORE
UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_property_viewings_modtime BEFORE
UPDATE ON property_viewings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_negotiations_modtime BEFORE
UPDATE ON negotiations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_rental_agreements_modtime BEFORE
UPDATE ON rental_agreements FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_agreement_comments_modtime BEFORE
UPDATE ON agreement_comments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-- Create functions for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE OR REPLACE FUNCTION property_search(search_term TEXT) RETURNS SETOF properties AS $$ BEGIN RETURN QUERY
SELECT *
FROM properties
WHERE status = 'available'
    AND (
        title ILIKE '%' || search_term || '%'
        OR description ILIKE '%' || search_term || '%'
        OR address ILIKE '%' || search_term || '%'
        OR city ILIKE '%' || search_term || '%'
        OR state ILIKE '%' || search_term || '%'
        OR zip_code ILIKE '%' || search_term || '%'
        OR property_type ILIKE '%' || search_term || '%'
    )
ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;