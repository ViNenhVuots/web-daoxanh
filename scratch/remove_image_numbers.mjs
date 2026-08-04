import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yftjeolsargnopvpfgji.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wo-r0sQQLv3AkTVyUSee1g_EMF7cjOX';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('Logging in...');
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: 'daoxanh_admin@gmail.com',
    password: 'DaoXanh2018@'
  });

  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  console.log('Logged in!');

  // Fetch all images
  const { data: images, error: fetchErr } = await supabase
    .from('gallery_images')
    .select('*');

  if (fetchErr) {
    console.error('Error fetching images:', fetchErr);
    return;
  }

  console.log(`Found ${images.length} images. Updating alt texts...`);

  let count = 0;
  for (const img of images) {
    if (img.alt && img.alt.includes(' - Ảnh ')) {
      // Extract the part before " - Ảnh "
      const newAlt = img.alt.split(' - Ảnh ')[0];
      
      const { error: updateErr } = await supabase
        .from('gallery_images')
        .update({ alt: newAlt })
        .eq('id', img.id);

      if (updateErr) {
        console.error(`Error updating image ${img.id}:`, updateErr);
      } else {
        count++;
      }
    }
  }

  console.log(`Successfully updated ${count} images!`);
}

main();
