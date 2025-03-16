/*
  # Initial Schema Setup for RentSmart Platform

  1. New Tables
    - profiles (user profiles with role information)
    - properties (property listings)
    - agreements (rental agreements)
    - agreement_versions (version history of agreements)
    - payments (payment records)
    - property_conditions (property condition reports)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Set up authentication triggers

  3. Relationships
    - Foreign key constraints between tables
    - Proper indexing for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type AS ENUM ('landlord', 'tenant');
CREATE TYPE agreement_status AS ENUM ('draft', 'pending', 'active', 'expired', 'terminated');
CREATE TYPE payment_type AS ENUM ('rent', 'deposit', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue');
CREATE TYPE report_type AS ENUM ('move-in', 'move-out', 'inspection');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_type user_type NOT NULL,
  full_name TEXT NOT NULL,
  contact_info JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES profiles(id),
  address TEXT NOT NULL,
  property_type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC(3,1) NOT NULL,
  amenities JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agreements table
CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  landlord_id UUID NOT NULL REFERENCES profiles(id),
  tenant_id UUID REFERENCES profiles(id),
  status agreement_status NOT NULL DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  rent_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agreement versions table
CREATE TABLE agreement_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id UUID NOT NULL REFERENCES agreements(id),
  content JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id UUID NOT NULL REFERENCES agreements(id),
  amount DECIMAL(10,2) NOT NULL,
  type payment_type NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Property conditions table
CREATE TABLE property_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  report_type report_type NOT NULL,
  report_date DATE NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_conditions ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Profiles policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Landlords can CRUD their own properties"
  ON properties FOR ALL
  TO authenticated
  USING (landlord_id = auth.uid());

CREATE POLICY "Tenants can view properties in their agreements"
  ON properties FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agreements
      WHERE agreements.property_id = properties.id
      AND agreements.tenant_id = auth.uid()
    )
  );

-- Agreements policies
CREATE POLICY "Landlords can CRUD their own agreements"
  ON agreements FOR ALL
  TO authenticated
  USING (landlord_id = auth.uid());

CREATE POLICY "Tenants can view their agreements"
  ON agreements FOR SELECT
  TO authenticated
  USING (tenant_id = auth.uid());

-- Agreement versions policies
CREATE POLICY "Users can view versions of their agreements"
  ON agreement_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agreements
      WHERE agreements.id = agreement_versions.agreement_id
      AND (agreements.landlord_id = auth.uid() OR agreements.tenant_id = auth.uid())
    )
  );

-- Payments policies
CREATE POLICY "Users can view payments for their agreements"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agreements
      WHERE agreements.id = payments.agreement_id
      AND (agreements.landlord_id = auth.uid() OR agreements.tenant_id = auth.uid())
    )
  );

-- Property conditions policies
CREATE POLICY "Users can view conditions for their properties"
  ON property_conditions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_conditions.property_id
      AND (
        properties.landlord_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM agreements
          WHERE agreements.property_id = properties.id
          AND agreements.tenant_id = auth.uid()
        )
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_agreements_property ON agreements(property_id);
CREATE INDEX idx_agreements_landlord ON agreements(landlord_id);
CREATE INDEX idx_agreements_tenant ON agreements(tenant_id);
CREATE INDEX idx_agreement_versions_agreement ON agreement_versions(agreement_id);
CREATE INDEX idx_payments_agreement ON payments(agreement_id);
CREATE INDEX idx_property_conditions_property ON property_conditions(property_id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, full_name, contact_info)
  VALUES (new.id, 'tenant', '', '{}');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();