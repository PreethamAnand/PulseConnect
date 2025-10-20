-- Add health form fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height DECIMAL(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bmi DECIMAL(4,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medications TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_tattoo BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_piercing BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_traveled_recently BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_surgery_recently BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pregnant BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_diabetes BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_hypertension BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_heart_disease BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_eligible BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_form_completed BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_health_form_completed ON profiles(health_form_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_is_eligible ON profiles(is_eligible);
CREATE INDEX IF NOT EXISTS idx_profiles_blood_type ON profiles(blood_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_available ON profiles(is_available);

-- Add constraints
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS check_age_range CHECK (age >= 18 AND age <= 65);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS check_weight_min CHECK (weight >= 50);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS check_height_range CHECK (height >= 150 AND height <= 200);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS check_bmi_range CHECK (bmi >= 15 AND bmi <= 50);

-- Update existing profiles to have health_form_completed = false
UPDATE profiles SET health_form_completed = FALSE WHERE health_form_completed IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN profiles.age IS 'Donor age (18-65 years)';
COMMENT ON COLUMN profiles.weight IS 'Donor weight in kg (minimum 50kg)';
COMMENT ON COLUMN profiles.height IS 'Donor height in cm (150-200cm)';
COMMENT ON COLUMN profiles.bmi IS 'Body Mass Index calculated from weight and height';
COMMENT ON COLUMN profiles.medical_conditions IS 'Current medical conditions';
COMMENT ON COLUMN profiles.medications IS 'Current medications being taken';
COMMENT ON COLUMN profiles.allergies IS 'Known allergies';
COMMENT ON COLUMN profiles.has_tattoo IS 'Has tattoos or piercings in last 6 months';
COMMENT ON COLUMN profiles.has_piercing IS 'Has piercings in last 6 months';
COMMENT ON COLUMN profiles.has_traveled_recently IS 'Has traveled internationally recently';
COMMENT ON COLUMN profiles.has_surgery_recently IS 'Has had surgery in last 6 months';
COMMENT ON COLUMN profiles.is_pregnant IS 'Currently pregnant or breastfeeding';
COMMENT ON COLUMN profiles.has_diabetes IS 'Has diabetes';
COMMENT ON COLUMN profiles.has_hypertension IS 'Has hypertension';
COMMENT ON COLUMN profiles.has_heart_disease IS 'Has heart disease';
COMMENT ON COLUMN profiles.emergency_contact IS 'Emergency contact name';
COMMENT ON COLUMN profiles.emergency_phone IS 'Emergency contact phone number';
COMMENT ON COLUMN profiles.city IS 'City of residence';
COMMENT ON COLUMN profiles.state IS 'State of residence';
COMMENT ON COLUMN profiles.zip_code IS 'ZIP/postal code';
COMMENT ON COLUMN profiles.is_eligible IS 'Whether donor is eligible for donation based on health form';
COMMENT ON COLUMN profiles.health_form_completed IS 'Whether health form has been completed';
