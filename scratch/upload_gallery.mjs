import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://yftjeolsargnopvpfgji.supabase.co'
const supabaseKey = 'sb_publishable_wo-r0sQQLv3AkTVyUSee1g_EMF7cjOX'
const supabase = createClient(supabaseUrl, supabaseKey)

// First, sign in as admin
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.log('Usage: node upload_gallery.mjs <admin_email> <admin_password>')
  process.exit(1)
}

async function run() {
  // Login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (authError) {
    console.error('Login failed:', authError.message)
    process.exit(1)
  }
  console.log('✅ Logged in as:', authData.user.email)

  // Define images to upload
  const images = [
    // === LƯU TRÚ ===
    {
      localPath: 'src/assets/accommodation/lan-la-hanh-ngo.jpg',
      alt: 'Lán lá Hạnh Ngộ - Nhà sàn bên bờ sông Serepok',
      category: 'Lưu trú',
      display_order: 1,
    },
    {
      localPath: 'src/assets/accommodation/bungalow-an-binh.jpg',
      alt: 'Bungalow An Bình - Nhà gỗ cao cấp giữa thiên nhiên',
      category: 'Lưu trú',
      display_order: 2,
    },
    {
      localPath: 'src/assets/accommodation/nha-thanh-thoi.jpg',
      alt: 'Nhà Thảnh Thơi - Family Hotel ấm cúng',
      category: 'Lưu trú',
      display_order: 3,
    },
    {
      localPath: 'src/assets/accommodation/leu-serepok.jpg',
      alt: 'Lều Sê Rê Pôk - Glamping đẳng cấp bên sông',
      category: 'Lưu trú',
      display_order: 4,
    },
    {
      localPath: 'src/assets/accommodation/homestay-an-yen.jpg',
      alt: 'Homestay An Yên - Không gian nghỉ dưỡng yên bình',
      category: 'Lưu trú',
      display_order: 5,
    },
    {
      localPath: 'src/assets/accommodation/nha-an-hoa.jpg',
      alt: 'Nhà An Hòa - Không gian lưu trú tiện nghi',
      category: 'Lưu trú',
      display_order: 6,
    },

    // === DỊCH VỤ ===
    {
      localPath: 'src/assets/services/nghi-duong.jpg',
      alt: 'Nghỉ dưỡng sinh thái tại Đảo Xanh Ecofarm',
      category: 'Dịch vụ',
      display_order: 1,
    },
    {
      localPath: 'src/assets/services/ngoai-troi.jpg',
      alt: 'Hoạt động ngoài trời - Team building & thể thao',
      category: 'Dịch vụ',
      display_order: 2,
    },
    {
      localPath: 'src/assets/services/am-thuc.jpg',
      alt: 'Ẩm thực Tây Nguyên - BBQ & lẩu đặc sản',
      category: 'Dịch vụ',
      display_order: 3,
    },
    {
      localPath: 'src/assets/services/nong-trai.jpg',
      alt: 'Trải nghiệm nông trại hữu cơ Đảo Xanh',
      category: 'Dịch vụ',
      display_order: 4,
    },
    {
      localPath: 'src/assets/hero-resort.jpg',
      alt: 'Toàn cảnh khu nghỉ dưỡng Đảo Xanh Ecofarm',
      category: 'Dịch vụ',
      display_order: 5,
    },
  ]

  let successCount = 0
  let errorCount = 0

  for (const img of images) {
    const fullPath = path.resolve(img.localPath)
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`)
      errorCount++
      continue
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const fileExt = path.extname(img.localPath).slice(1)
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Check file size
    const fileSizeMB = fileBuffer.length / (1024 * 1024)
    console.log(`📁 Uploading: ${img.localPath} (${fileSizeMB.toFixed(1)}MB)...`)

    if (fileSizeMB > 5) {
      console.warn(`⚠️  Skipped (>5MB limit): ${img.localPath}`)
      errorCount++
      continue
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('content-images')
      .upload(fileName, fileBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error(`❌ Upload failed for ${img.localPath}:`, uploadError.message)
      errorCount++
      continue
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('content-images')
      .getPublicUrl(uploadData.path)

    const publicUrl = urlData.publicUrl
    console.log(`  → URL: ${publicUrl}`)

    // Insert into gallery_images table
    const { error: insertError } = await supabase
      .from('gallery_images')
      .insert([{
        src: publicUrl,
        alt: img.alt,
        category: img.category,
        display_order: img.display_order,
      }])

    if (insertError) {
      console.error(`❌ DB insert failed for ${img.localPath}:`, insertError.message)
      errorCount++
      continue
    }

    console.log(`  ✅ Done: ${img.alt}`)
    successCount++
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n🎉 Upload complete! Success: ${successCount}, Errors: ${errorCount}`)
  
  // Show final gallery count
  const { data: gallery, error: galleryError } = await supabase
    .from('gallery_images')
    .select('category')
  
  if (!galleryError && gallery) {
    const counts = {}
    gallery.forEach(g => {
      counts[g.category] = (counts[g.category] || 0) + 1
    })
    console.log('\n📊 Gallery summary:')
    Object.entries(counts).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} ảnh`)
    })
  }
}

run().catch(console.error)
