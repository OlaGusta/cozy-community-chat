CREATE OR REPLACE FUNCTION public.get_users_with_last_message(current_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  is_online boolean,
  last_seen timestamptz,
  is_admin boolean,
  avatar text,
  apartment text,
  content text,
  created_at timestamptz
)
LANGUAGE sql STABLE AS $$
  select p.id,
         p.name,
         p.is_online,
         p.last_seen,
         p.is_admin,
         p.avatar,
         p.apartment,
         dm.content,
         dm.created_at
  from profiles p
  left join lateral (
    select content, created_at
    from direct_messages
    where (sender_id = current_user_id and recipient_id = p.id)
       or (sender_id = p.id and recipient_id = current_user_id)
    order by created_at desc
    limit 1
  ) dm on true
  where p.id <> current_user_id;
$$;
