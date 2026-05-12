-- Run this in the Supabase SQL editor to set up the schema and seed data

-- Tables
create table if not exists ma_profiles (
  id            serial primary key,
  name          text not null,
  join_date     date not null,
  latest_rotation text,
  photo_path    text,
  sort_order    int
);

create table if not exists slide_content (
  id            serial primary key,
  slide_id      text unique not null,
  title         text,
  video_url_1   text,
  video_url_2   text,
  video_url_3   text
);

-- Storage buckets (create via Dashboard or CLI):
-- bucket: MA photos    (public)
-- bucket: slide-videos (public)

-- RLS policies
alter table ma_profiles enable row level security;
create policy "public read" on ma_profiles for select using (true);
create policy "anon write" on ma_profiles for all using (true) with check (true);

alter table slide_content enable row level security;
create policy "public read" on slide_content for select using (true);
create policy "anon write" on slide_content for all using (true) with check (true);

-- Seed MA profiles (ordered by join_date ascending)
insert into ma_profiles (id, name, join_date, latest_rotation, photo_path, sort_order) values
  (1,  'Xia Zhiyu (Iris)',       '2024-07-05', 'Rotation 4: GI Marketing (Helen Hu)',              'ma-photos/iris.jpg',     1),
  (2,  'Liu Shujian (Harry)',    '2024-07-05', 'Rotation 3: FF NA User Growth (Jason Lim)',         'ma-photos/harry.jpg',    2),
  (3,  'Jin Yingjie (Joyce)',    '2025-02-24', 'Rotation 3: GI Daydream Game Design',              'ma-photos/joyce.jpg',    3),
  (4,  'Yan Wei',                '2025-03-03', 'Rotation 3: Craftland PUGC (Zeus)',                 'ma-photos/yanwei.jpg',   4),
  (5,  'Zhuang Yuan (Mitty)',    '2025-06-30', 'Rotation 2: GI Onemore (Tang Jiaqi)',               'ma-photos/mitty.jpg',    5),
  (6,  'Joan Chin',              '2025-07-14', 'Rotation 2: GI PM (Tang Jiaqi)',                   'ma-photos/joan.jpg',     6),
  (7,  'Shang Ruting',           '2026-01-05', 'Rotation 1: AOV Regional Product (Helen Chang)',    'ma-photos/ruting.jpg',   7),
  (8,  'Xu Zhanxiao',            '2026-01-05', 'Rotation 1: Executive Office (Helen Hu)',           'ma-photos/zhanxiao.jpg', 8),
  (9,  'Chen Haolin',            '2026-02-25', 'Pre-MA Internship: FF Dev PM (Han Yu)',             'ma-photos/haolin.jpg',   9),
  (10, 'Joshua Lim',             '2026-03-02', 'Rotation 1: FF Regional UR (Fuji)',                 'ma-photos/joshua.jpg',   10)
on conflict (id) do nothing;

-- Add tags column
alter table ma_profiles add column if not exists tags text[];

-- Seed initial tags for presenters
update ma_profiles set tags = array['Free Fire', 'Product', 'Regional Ops'] where id = 3;
update ma_profiles set tags = array['Free Fire', 'BD Marketing', 'Branding'] where id = 1;
update ma_profiles set tags = array['Delta Force', 'Marketing', 'Regional'] where id = 6;
update ma_profiles set tags = array['Roblox', 'Game Design', 'PUGC'] where id = 4;
update ma_profiles set tags = array['Executive Office', 'Strategy'] where id = 5;

-- Seed slide content stubs
insert into slide_content (slide_id, title) values
  ('slide3', 'MA AI-Video Introduction'),
  ('slide4', 'MA AI-Video Introduction'),
  ('slide5', 'MA AI-Video Introduction')
on conflict (slide_id) do nothing;
