begin
  UPDATE profile SET money = money - amount WHERE id = user_id;
end;