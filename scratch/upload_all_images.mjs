import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars if needed, but we can hardcode for this script
const SUPABASE_URL = 'https://yftjeolsargnopvpfgji.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wo-r0sQQLv3AkTVyUSee1g_EMF7cjOX';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categoryMap = {
  'Bungalow an bình': 'Bungalow An Bình',
  'Lều Sêrêpôk': 'Lều Sê Rê Pốk',
  'Lều Độc cư': 'Lều Độc Cư',
  'thảnh thơi': 'Nhà Thảnh Thơi 1',
};

async function main() {
  console.log('Logging in...');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'daoxanh_admin@gmail.com',
    password: 'DaoXanh2018@'
  });

  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  
  console.log('Logged in!');

  const baseDir = 'd:\\web-daoxanh\\ảnh đảo xanh';
  const folders = fs.readdirSync(baseDir);

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const category = categoryMap[folder] || 'Cảnh quan';
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) continue;

      const filePath = path.join(folderPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      const fileExt = file.split('.').pop().toLowerCase();
      let mimeType = `image/${fileExt}`;
      if (fileExt === 'jpg') mimeType = 'image/jpeg';

      const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      console.log(`Uploading ${file} from ${folder}...`);

      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, fileBuffer, {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file}:`, error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('content-images')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      const altText = `${folder} - ${file.split('.')[0]}`;

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert([{
          src: publicUrl,
          alt: altText,
          category: category,
          display_order: 0
        }]);

      if (insertError) {
        console.error(`Error inserting ${file} into DB:`, insertError);
      } else {
        console.log(`Successfully added ${file} to gallery.`);
      }
    }
  }
  console.log('Done!');
}

main();
