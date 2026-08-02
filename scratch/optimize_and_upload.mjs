import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: 'daoxanh_admin@gmail.com',
    password: 'DaoXanh2018@'
  });

  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  console.log('Logged in!');

  // 1. Delete previous faulty images
  console.log('Deleting old faulty images from database...');
  const { error: deleteErr } = await supabase
    .from('gallery_images')
    .delete()
    .like('alt', '%z7994%');
  
  if (deleteErr) {
    console.error('Error deleting old images:', deleteErr);
  } else {
    console.log('Deleted successfully.');
  }

  const baseDir = 'd:\\web-daoxanh\\ảnh đảo xanh';
  const folders = fs.readdirSync(baseDir);

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const category = categoryMap[folder] || 'Cảnh quan';
    const files = fs.readdirSync(folderPath);

    let index = 1;
    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) continue;

      const filePath = path.join(folderPath, file);
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`Optimizing ${file} from ${folder}...`);
      
      // Optimize image using sharp
      const optimizedBuffer = await sharp(fileBuffer)
        .resize({ width: 1920, withoutEnlargement: true }) // resize if larger than 1920px
        .webp({ quality: 80 }) // compress using WebP
        .toBuffer();

      const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      console.log(`Uploading ${fileName}...`);

      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, optimizedBuffer, {
          contentType: 'image/webp',
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
      const altText = `${category} - Ảnh ${index}`;

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert([{
          src: publicUrl,
          alt: altText,
          category: category,
          display_order: index
        }]);

      if (insertError) {
        console.error(`Error inserting ${altText} into DB:`, insertError);
      } else {
        console.log(`Successfully added ${altText} to gallery.`);
      }
      index++;
    }
  }
  console.log('Done optimization and uploading!');
}

main();
