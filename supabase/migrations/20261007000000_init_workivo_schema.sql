-- =========================================================
-- WORKIVO 2.0 SUPABASE POSTGRESQL DATABASE SCHEMA
-- Run this in your Supabase Project SQL Editor
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    tag TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    badge TEXT NOT NULL,
    price_estimate TEXT NOT NULL,
    duration TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings Table (Customer Service Requests)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    status TEXT CHECK (status IN ('pending', 'matched', 'on_the_way', 'in_progress', 'completed', 'cancelled')) DEFAULT 'matched',
    price_estimate TEXT NOT NULL,
    s3_photo_key TEXT,
    pro_assigned_name TEXT DEFAULT 'Rajesh Kumar',
    pro_assigned_phone TEXT DEFAULT '+91 98112 34567',
    pro_rating NUMERIC(2, 1) DEFAULT 4.9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Pro Applications Table (Workers joining Workivo)
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
CREATE POLICY "Allow public read access on services" 
    ON public.services FOR SELECT USING (true);

-- Allow anyone to create bookings and read their own bookings by phone or ID
CREATE POLICY "Allow insert on bookings" 
    ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read on bookings" 
    ON public.bookings FOR SELECT USING (true);

CREATE POLICY "Allow update on bookings" 
    ON public.bookings FOR UPDATE USING (true);

-- Allow anyone to submit pro application
CREATE POLICY "Allow insert on pro_applications" 
    ON public.pro_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read on pro_applications" 
    ON public.pro_applications FOR SELECT USING (true);

-- 6. Insert Default Workivo Services
INSERT INTO public.services (id, number, title, tag, description, image_url, badge, price_estimate, duration, rating, reviews_count)
VALUES
('electrician', '01', 'Electrician', 'Electrician', 'Switches, wiring and fittings sorted safely, right in your home.', '/images/electrician.jpg', 'Verified Electrician', 'From ₹249', '45–90 mins', 4.9, 1420),
('cook', '02', 'Home cooking', 'Home cooking', 'A cook in your own kitchen, from everyday meals to guests at home.', '/images/cook.jpg', 'Professional Cook', 'From ₹399/meal', '1–2 hours', 4.9, 2180),
('barber', '03', 'Barber at home', 'Barber at home', 'A fresh haircut without leaving the sofa or losing your evening.', '/images/barber.jpg', 'Master Stylist', 'From ₹299', '30–45 mins', 4.8, 1840),
('beauty', '04', 'Nails and beauty', 'Nails and beauty', 'Manicure and pedicure in comfort, on your schedule.', '/images/beauty.jpg', 'Certified Beautician', 'From ₹499', '60–90 mins', 4.9, 3120),
('carpenter', '05', 'Furniture repair', 'Furniture repair', 'Wobbly chairs and broken frames fixed by skilled hands.', '/images/carpenter.jpg', 'Expert Carpenter', 'From ₹349', '1–2 hours', 4.8, 960),
('plumber', '06', 'Plumbing', 'Plumbing', 'Leaks, taps and drains handled with clean, careful work.', '/images/plumber.jpg', 'Certified Plumber', 'From ₹249', '30–60 mins', 4.9, 2450),
('cleaning', '07', 'Home cleaning', 'Home cleaning', 'Kitchens, dishes and every corner left fresh and tidy.', '/images/cleaning.jpg', 'Deep Clean Crew', 'From ₹799', '2–4 hours', 4.9, 4200),
('ac-service', '08', 'AC service', 'AC service', 'Home or office, your cooling checked and running well again.', '/images/ac-service.jpg', 'HVAC Specialist', 'From ₹449', '45–60 mins', 4.8, 1980),
('movers', '09', 'Packers and movers', 'Packers and movers', 'Careful packing and a team that treats your things like their own.', '/images/movers.jpg', 'Relocation Team', 'Custom Quote', 'Half / Full day', 4.9, 870),
('laundry', '10', 'Laundry', 'Laundry', 'Sorted, washed and folded, so your weekend is yours again.', '/images/laundry.jpg', 'Wash & Iron Care', 'From ₹199', 'Same day / 24 hrs', 4.8, 1650)
ON CONFLICT (id) DO NOTHING;
