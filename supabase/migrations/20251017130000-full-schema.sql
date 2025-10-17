-- Full database schema for BloodConnect (unified)
-- Extensions
create extension if not exists pgcrypto;

-- Profiles (users/donors)
create table if not exists public.profiles (
  id uuid primary key,
  email text,
  first_name text,
  last_name text,
  phone text,
  blood_type text,
  is_available boolean default true,
  location_sharing boolean default false,
  verified boolean default false,
  two_factor_enabled boolean default false,
  is_mobile_verified boolean default false,
  last_donation_date timestamptz,
  next_eligible_date timestamptz,
  donation_type text,
  created_at timestamptz not null default now()
);

-- Ensure unique emails when present
create unique index if not exists uq_profiles_email on public.profiles (lower(email)) where email is not null;

-- Hospitals (optional first-class entity)
create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  contact text,
  created_at timestamptz not null default now()
);

-- Requests (unified blood/plasma)
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  request_type varchar(20) default 'blood', -- blood | plasma
  component_type varchar(50), -- for plasma
  condition text, -- optional
  blood_group text, -- for blood/plasma group
  quantity_ml integer,
  urgency text, -- Low | Medium | High | Emergency
  patient_name text,
  hospital text,
  hospital_id text,
  hospital_uuid uuid, -- optional FK to hospitals
  location text,
  notes text,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Constraints for requests
do $$ begin
  alter table public.requests add constraint chk_requests_type check (request_type in ('blood','plasma'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.requests add constraint chk_requests_urgency check (urgency in ('Low','Medium','High','Emergency'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.requests add constraint chk_requests_quantity check (quantity_ml is null or quantity_ml > 0);
exception when duplicate_object then null; end $$;

-- Foreign keys for requests
do $$ begin
  alter table public.requests add constraint fk_requests_created_by foreign key (created_by) references public.profiles(id) on delete set null;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.requests add constraint fk_requests_hospital_uuid foreign key (hospital_uuid) references public.hospitals(id) on delete set null;
exception when duplicate_object then null; end $$;

-- Plasma inventory and donations
create table if not exists public.plasma_inventory (
  id uuid primary key default gen_random_uuid(),
  hospital_id text not null,
  hospital_uuid uuid,
  plasma_type text not null,
  units integer not null default 0,
  component_status text not null default 'available',
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_plasma_inventory_hosp_type on public.plasma_inventory (coalesce(hospital_id,''), plasma_type);
create index if not exists idx_plasma_inventory_hospital on public.plasma_inventory (hospital_id);

do $$ begin
  alter table public.plasma_inventory add constraint fk_plasma_inventory_hospital_uuid foreign key (hospital_uuid) references public.hospitals(id) on delete set null;
exception when duplicate_object then null; end $$;

create table if not exists public.plasma_donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null,
  hospital_id text not null,
  hospital_uuid uuid,
  plasma_type text not null,
  donation_volume_ml integer not null check (donation_volume_ml > 0),
  extracted_date timestamptz not null default now(),
  expiry_date timestamptz not null,
  component_status text not null default 'available',
  created_at timestamptz not null default now()
);

-- FKs for plasma_donations
do $$ begin
  alter table public.plasma_donations add constraint fk_plasma_donations_donor foreign key (donor_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.plasma_donations add constraint fk_plasma_donations_hospital_uuid foreign key (hospital_uuid) references public.hospitals(id) on delete set null;
exception when duplicate_object then null; end $$;

-- Blockchain ledger
create table if not exists public.blockchain_ledger (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid,
  hospital_id text,
  hospital_uuid uuid,
  donation_type text not null, -- blood | plasma
  tx_hash text not null,
  network text not null default 'polygon',
  status text not null default 'pending',
  timestamp timestamptz not null default now()
);

-- Indexes/FKs for blockchain_ledger
create index if not exists idx_blockchain_ledger_donor on public.blockchain_ledger (donor_id);
create index if not exists idx_blockchain_ledger_hospital on public.blockchain_ledger (hospital_id);
create index if not exists idx_blockchain_ledger_timestamp on public.blockchain_ledger (timestamp);

do $$ begin
  alter table public.blockchain_ledger add constraint fk_blockchain_ledger_donor foreign key (donor_id) references public.profiles(id) on delete set null;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.blockchain_ledger add constraint fk_blockchain_ledger_hospital_uuid foreign key (hospital_uuid) references public.hospitals(id) on delete set null;
exception when duplicate_object then null; end $$;

-- Appointments (donor → hospital)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null,
  hospital_id text not null,
  hospital_uuid uuid,
  request_id uuid,
  donation_type text not null check (donation_type in ('blood','plasma')),
  status text not null default 'pending',
  appointment_date timestamptz default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_appointments_hospital on public.appointments (hospital_id);
create index if not exists idx_appointments_donor on public.appointments (donor_id);

do $$ begin
  alter table public.appointments add constraint fk_appointments_donor foreign key (donor_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.appointments add constraint fk_appointments_request foreign key (request_id) references public.requests(id) on delete set null;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.appointments add constraint fk_appointments_hospital_uuid foreign key (hospital_uuid) references public.hospitals(id) on delete set null;
exception when duplicate_object then null; end $$;

-- Helpful indexes on requests
create index if not exists idx_requests_hospital on public.requests (hospital_id);
create index if not exists idx_requests_type on public.requests (request_type);
create index if not exists idx_requests_urgency on public.requests (urgency);
create index if not exists idx_requests_created_at on public.requests (created_at);

-- Minimal RLS example (customize as needed)
alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.plasma_inventory enable row level security;
alter table public.plasma_donations enable row level security;
alter table public.blockchain_ledger enable row level security;
alter table public.appointments enable row level security;
alter table public.hospitals enable row level security;

-- Example permissive policies (adjust for production)
do $$ begin
  create policy "public read profiles" on public.profiles for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read requests" on public.requests for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read plasma_inventory" on public.plasma_inventory for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read blockchain_ledger" on public.blockchain_ledger for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read appointments" on public.appointments for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read hospitals" on public.hospitals for select using (true);
exception when duplicate_object then null; end $$;

-- Basic write policies for authenticated users (adjust for production)
do $$ begin
  create policy "auth upsert own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth insert requests" on public.requests for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth update requests" on public.requests for update using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth insert appointments" on public.appointments for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth update appointments" on public.appointments for update using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth insert plasma_inventory" on public.plasma_inventory for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth update plasma_inventory" on public.plasma_inventory for update using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth insert plasma_donations" on public.plasma_donations for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth insert blockchain_ledger" on public.blockchain_ledger for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

