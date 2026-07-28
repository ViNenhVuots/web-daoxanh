import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yftjeolsargnopvpfgji.supabase.co'
const supabaseKey = 'sb_publishable_wo-r0sQQLv3AkTVyUSee1g_EMF7cjOX'
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateDb() {
  const { data, error } = await supabase
    .from('combo_packages')
    .update({ includes: ["Bao gồm các dịch vụ của Gói A", "Tùy chọn lưu trú: Nhà Thảnh Thơi, Lều SêRêPôk"] })
    .eq('slug', 'goi-a1')
    .select()

  console.log("Combo package update:", error ? error : data)

  const { data: accData, error: accError } = await supabase
    .from('accommodations')
    .update({ published: false })
    .in('slug', ['homestay-an-yen', 'nha-an-hoa'])
    .select()
    
  console.log("Accommodations disable:", accError ? accError : accData)

  const { data: leuData, error: leuError } = await supabase
    .from('accommodations')
    .update({ capacity: '1 khách/lều', unit: '1 khách/lều', price_original: 550000 })
    .eq('slug', 'leu-serepok')
    .select()

  console.log("Leu update:", leuError ? leuError : leuData)
}

updateDb()
