import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yftjeolsargnopvpfgji.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wo-r0sQQLv3AkTVyUSee1g_EMF7cjOX';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'daoxanh_admin@gmail.com',
    password: 'DaoXanh2018@'
  });
  
  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  
  console.log('Logged in as:', authData.user?.id);
  
  const { data: roleData, error: roleErr } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', authData.user?.id);
    
  console.log('Role data:', roleData);
  console.log('Role err:', roleErr);
  
  const { data: rpcData, error: rpcErr } = await supabase.rpc('has_role', {
    _user_id: authData.user?.id,
    _role: 'admin'
  });
  
  console.log('RPC data:', rpcData);
  console.log('RPC err:', rpcErr);
}

test();
