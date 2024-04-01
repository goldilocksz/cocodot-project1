
begin
  insert into public.profile (id, name, phone, depositor, bank, account, ip)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'depositor',
    new.raw_user_meta_data ->> 'bank',
    new.raw_user_meta_data ->> 'account',
    new.raw_user_meta_data ->> 'ip'
  );
  return new;
end;
