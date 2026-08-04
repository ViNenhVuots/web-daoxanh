import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yftjeolsargnopvpfgji.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wo-r0sQQLv3AkTVyUSee1g_EMF7cjOX';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'daoxanh_admin@gmail.com',
    password: 'DaoXanh2018@'
  });

  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }

  const { data: images, error } = await supabase
    .from('gallery_images')
    .select('id, alt, src')
    .order('created_at', { ascending: true }); // Order by created_at so index is predictable

  if (error) {
    console.error(error);
    return;
  }

  const groupCounts = {};

  for (const img of images) {
    if (img.alt.includes(' - z')) {
      const parts = img.alt.split(' - z');
      const prefix = parts[0];
      
      if (!groupCounts[prefix]) {
        groupCounts[prefix] = 1;
      }
      
      const newAlt = `${prefix} - ${groupCounts[prefix]}`;
      groupCounts[prefix]++;

      console.log(`Updating ${img.alt} -> ${newAlt}`);

      await supabase
        .from('gallery_images')
        .update({ alt: newAlt })
        .eq('id', img.id);
    }
  }
  console.log('Done');
}

main();
