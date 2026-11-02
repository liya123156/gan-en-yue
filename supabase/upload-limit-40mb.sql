-- Raise the metadata limit without altering publication or access policies.
alter table public.gratitude_materials drop constraint gratitude_materials_size_check;
alter table public.gratitude_materials add constraint gratitude_materials_size_check
  check (size > 0 and size <= 41943040);
-- gratitude-admin aligns the bucket file_size_limit through the Storage API,
-- preserving the existing bucket visibility and MIME type restrictions.
