-- =========================================================
-- WORKIVO 2.0 SUPABASE POSTGRESQL DATABASE SCHEMA
-- Compatible with new setups & existing migrations
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vxiyopjjyohcapmtvlef/sql/new
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table (Create or alter existing)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add Workivo 2.0 columns to services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS number TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_estimate TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) DEFAULT 4.9;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 100;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_unit TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS estimated_duration TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS badge_text TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS badge_variant TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT false;

-- 3. Bookings Table (Create or alter existing)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add Workivo 2.0 columns to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_code TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_title TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS scheduled_time TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS address_line TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'matched';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_estimate TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_amount NUMERIC;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'upi';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS s3_photo_key TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pro_assigned_name TEXT DEFAULT 'Rajesh Kumar';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pro_assigned_phone TEXT DEFAULT '+91 98112 34567';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pro_rating NUMERIC(2, 1) DEFAULT 4.9;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure legacy constraints don't block new inserts
DO $$
BEGIN
    ALTER TABLE public.bookings ALTER COLUMN booking_code DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.bookings ALTER COLUMN service_title DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.bookings ALTER COLUMN worker_name DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.bookings ALTER COLUMN address_line DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.bookings ALTER COLUMN deposit_amount DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.bookings ALTER COLUMN total_amount DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 4. Pro Applications Table (Workers applying to Workivo)
CREATE TABLE IF NOT EXISTS public.pro_applications (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    trade TEXT NOT NULL,
    experience_years INT NOT NULL,
    city TEXT NOT NULL,
    s3_document_key TEXT,
    status TEXT CHECK (status IN ('submitted', 'under_review', 'approved')) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_applications ENABLE ROW LEVEL SECURITY;

-- Allow public read access to services
DROP POLICY IF EXISTS "Allow public read access on services" ON public.services;
CREATE POLICY "Allow public read access on services" 
    ON public.services FOR SELECT USING (true);

-- Allow booking operations
DROP POLICY IF EXISTS "Allow insert on bookings" ON public.bookings;
CREATE POLICY "Allow insert on bookings" 
    ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read on bookings" ON public.bookings;
CREATE POLICY "Allow read on bookings" 
    ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update on bookings" ON public.bookings;
CREATE POLICY "Allow update on bookings" 
    ON public.bookings FOR UPDATE USING (true);

-- Allow pro applications
DROP POLICY IF EXISTS "Allow insert on pro_applications" ON public.pro_applications;
CREATE POLICY "Allow insert on pro_applications" 
    ON public.pro_applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read on pro_applications" ON public.pro_applications;
CREATE POLICY "Allow read on pro_applications" 
    ON public.pro_applications FOR SELECT USING (true);

-- 6. Insert All 10 Core Workivo Services
INSERT INTO public.services (id, number, title, tag, description, image_url, badge, price_estimate, duration, rating, reviews_count, category, price, price_unit)
VALUES
('electrician', '01', 'Electrician', 'Electrician', 'Switches, wiring and fittings sorted safely, right in your home.', '/images/electrician.jpg', 'Verified Electrician', 'From ₹249', '45–90 mins', 4.9, 1420, 'electrical', 249, 'fixed'),
('cook', '02', 'Home cooking', 'Home cooking', 'A cook in your own kitchen, from everyday meals to guests at home.', '/images/cook.jpg', 'Professional Cook', 'From ₹399/meal', '1–2 hours', 4.9, 2180, 'cooking', 399, '/meal'),
('barber', '03', 'Barber at home', 'Barber at home', 'A fresh haircut without leaving the sofa or losing your evening.', '/images/barber.jpg', 'Master Stylist', 'From ₹299', '30–45 mins', 4.8, 1840, 'grooming', 299, 'fixed'),
('beauty', '04', 'Nails and beauty', 'Nails and beauty', 'Manicure and pedicure in comfort, on your schedule.', '/images/beauty.jpg', 'Certified Beautician', 'From ₹499', '60–90 mins', 4.9, 3120, 'beauty', 499, 'package'),
('carpenter', '05', 'Furniture repair', 'Furniture repair', 'Wobbly chairs and broken frames fixed by skilled hands.', '/images/carpenter.jpg', 'Expert Carpenter', 'From ₹349', '1–2 hours', 4.8, 960, 'carpentry', 349, 'fixed'),
('plumber', '06', 'Plumbing', 'Plumbing', 'Leaks, taps and drains handled with clean, careful work.', '/images/plumber.jpg', 'Certified Plumber', 'From ₹249', '30–60 mins', 4.9, 2450, 'plumbing', 249, 'fixed'),
('cleaning', '07', 'Home cleaning', 'Home cleaning', 'Kitchens, dishes and every corner left fresh and tidy.', '/images/cleaning.jpg', 'Deep Clean Crew', 'From ₹799', '2–4 hours', 4.9, 4200, 'cleaning', 799, 'package'),
('ac-service', '08', 'AC service', 'AC service', 'Home or office, your cooling checked and running well again.', '/images/ac-service.jpg', 'HVAC Specialist', 'From ₹449', '45–60 mins', 4.8, 1980, 'cooling', 449, 'fixed'),
('movers', '09', 'Packers and movers', 'Packers and movers', 'Careful packing and a team that treats your things like their own.', '/images/movers.jpg', 'Relocation Team', 'Custom Quote', 'Half / Full day', 4.9, 870, 'relocation', 1499, 'quote'),
('laundry', '10', 'Laundry', 'Laundry', 'Sorted, washed and folded, so your weekend is yours again.', '/images/laundry.jpg', 'Wash & Iron Care', 'From ₹199', 'Same day / 24 hrs', 4.8, 1650, 'laundry', 199, 'fixed')
ON CONFLICT (id) DO UPDATE SET
  number = EXCLUDED.number,
  title = EXCLUDED.title,
  tag = EXCLUDED.tag,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  badge = EXCLUDED.badge,
  price_estimate = EXCLUDED.price_estimate,
  duration = EXCLUDED.duration,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count;
