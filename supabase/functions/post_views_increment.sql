create function post_views_increment (post_id uuid) 
returns void as $$
  begin
    update post 
    set views = views + 1
    where id = post_id;
  end;
$$ language volatile;