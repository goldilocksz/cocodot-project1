create function post_views_increment (id text) 
returns void as
$$
  update post 
  set views = views + 1
  where id = id
$$ 
language sql volatile;