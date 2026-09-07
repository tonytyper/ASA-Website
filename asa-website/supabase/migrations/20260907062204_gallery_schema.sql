-- Gallery data model: albums of event photos, uploaded by officers,
-- readable by anyone visiting the site.
--
-- Files live in the `gallery` storage bucket; this schema stores only the
-- metadata next/image needs (dimensions and a blur placeholder), because
-- remote images give the component nothing to infer an aspect ratio from.

create table public.albums (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  event_date  date,
  description text,
  created_at  timestamptz not null default now()
);

create table public.photos (
  id            uuid primary key default gen_random_uuid(),
  album_id      uuid not null references public.albums(id) on delete cascade,
  storage_path  text not null unique,
  width         integer not null,
  height        integer not null,
  -- tiny base64 JPEG, generated at upload; <Image> only auto-generates this
  -- for static imports, never for remote sources
  blur_data_url text not null,
  alt           text,
  is_cover      boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index photos_album_order_idx on public.photos (album_id, sort_order);

-- Partial unique index: at most one cover per album, but any number of
-- non-cover photos. A plain unique constraint would allow only one
-- non-cover photo per album, since it would treat every `false` as a value.
create unique index photos_one_cover_per_album_idx
  on public.photos (album_id)
  where is_cover;

-- ── Row level security ──
-- Public site reads with the anon key, so reads are open. Every write path
-- requires a logged-in officer; there is no public signup, so `authenticated`
-- means an account invited from the Supabase dashboard.

alter table public.albums enable row level security;
alter table public.photos enable row level security;

create policy "albums are publicly readable"
  on public.albums for select
  to anon, authenticated
  using (true);

create policy "officers manage albums"
  on public.albums for all
  to authenticated
  using (true)
  with check (true);

create policy "photos are publicly readable"
  on public.photos for select
  to anon, authenticated
  using (true);

create policy "officers manage photos"
  on public.photos for all
  to authenticated
  using (true)
  with check (true);

-- ── Storage ──
-- Public bucket: reads bypass RLS so <Image> can fetch without a signed URL.
-- Writes still go through the policies below.

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "gallery files are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

create policy "officers upload gallery files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "officers delete gallery files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');
