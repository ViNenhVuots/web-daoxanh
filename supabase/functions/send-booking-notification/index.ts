import { z } from "zod";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Allowed origins for CORS - production and preview domains
const ALLOWED_ORIGINS = [
  "https://daoxanh-web.vercel.app",
  "https://id-preview--9d9b0256-de85-42e2-bb2b-dd6b69e11cbb.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 booking requests per minute per IP

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean expired entries periodically
const cleanExpiredEntries = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Check rate limit for a given IP
const checkRateLimit = (clientIp: string): { allowed: boolean; remaining: number; resetIn: number } => {
  cleanExpiredEntries();
  
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);
  
  if (!record || now > record.resetTime) {
    // First request or window expired - create new record
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  // Increment counter
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetIn: record.resetTime - now };
};

// Get CORS headers based on request origin
const getCorsHeaders = (origin: string | null): Record<string, string> => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

// HTML escape function to prevent XSS/injection in email
const escapeHtml = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Zod schema for booking validation with honeypot field
const bookingSchema = z.object({
  bookingCode: z.string().min(1).max(50),
  name: z.string().min(1, "Họ tên không được để trống").max(100, "Họ tên quá dài"),
  email: z.string().email("Email không hợp lệ").max(255, "Email quá dài"),
  phone: z.string().regex(/^[0-9+\-\s()]{8,20}$/, "Số điện thoại không hợp lệ"),
  // checkIn/checkOut can be empty for day-trip bookings
  checkIn: z.string().max(50).optional().default(""),
  checkOut: z.string().max(50).optional().default(""),
  adultsCount: z.number().min(1, "Cần ít nhất 1 người lớn").max(100, "Số lượng quá lớn"),
  childrenCount: z.number().min(0).max(100, "Số lượng quá lớn"),
  serviceType: z.enum(["combo", "day-trip", "stay"]),
  serviceName: z.string().min(1).max(200),
  packageName: z.string().max(200).optional(),
  packageSubtitle: z.string().max(500).optional(),
  accommodationType: z.string().max(100).optional(),
  addBBQ: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  packageId: z.string().max(50).optional(),
  // Honeypot field - should always be empty if submitted by a human
  website: z.string().max(0).optional(),
});

type BookingRequest = z.infer<typeof bookingSchema>;

// Pricing data - matching frontend packageId values
const COMBO_PACKAGES: Record<string, { adultPrice: number; childPrice: number }> = {
  "combo-a": { adultPrice: 454000, childPrice: 314000 },
  "combo-a1": { adultPrice: 524000, childPrice: 384000 },
  "combo-a2": { adultPrice: 734000, childPrice: 594000 },
};

const DAY_TRIP_PACKAGES: Record<
  string,
  { adultPrice: number; childPrice: number; bbqPriceAdult?: number; bbqPriceChild?: number }
> = {
  "daytrip-a": { adultPrice: 84000, childPrice: 59000 },
  "daytrip-a1": { adultPrice: 137000, childPrice: 112000, bbqPriceAdult: 258000, bbqPriceChild: 209000 },
  "daytrip-a2": { adultPrice: 189000, childPrice: 165000, bbqPriceAdult: 314000, bbqPriceChild: 265000 },
};

const ACCOMMODATION_PRICES: Record<string, number> = {
  "Lán lá Hạnh Ngộ": 336000,
  "Homestay An Yên": 700000,
  "Bungalow An Bình": 1330000,
  "Nhà Thảnh Thơi": 910000,
  "Nhà An Hòa": 910000,
  "Lều Sê Rê Pôk": 840000,
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

const calculateTotalPrice = (bookingData: BookingRequest): number => {
  const { serviceType, packageId, adultsCount, childrenCount, accommodationType, addBBQ, checkIn, checkOut } =
    bookingData;

  console.log("Calculating price for:", {
    serviceType,
    packageId,
    adultsCount,
    childrenCount,
    accommodationType,
    addBBQ,
  });

  let total = 0;

  if (serviceType === "combo" && packageId) {
    const packageData = COMBO_PACKAGES[packageId];
    console.log("Combo package data:", packageData);
    if (packageData) {
      total = adultsCount * packageData.adultPrice + childrenCount * packageData.childPrice;

      // Add accommodation for combo-a1
      if (packageId === "combo-a1" && accommodationType && ACCOMMODATION_PRICES[accommodationType]) {
        total += ACCOMMODATION_PRICES[accommodationType];
      }
    }
  } else if (serviceType === "day-trip" && packageId) {
    const packageData = DAY_TRIP_PACKAGES[packageId];
    console.log("Day trip package data:", packageData);
    if (packageData) {
      // Use BBQ prices if BBQ is selected and available
      if (addBBQ && packageData.bbqPriceAdult && packageData.bbqPriceChild) {
        total = adultsCount * packageData.bbqPriceAdult + childrenCount * packageData.bbqPriceChild;
      } else {
        total = adultsCount * packageData.adultPrice + childrenCount * packageData.childPrice;
      }
    }
  } else if (serviceType === "stay" && accommodationType) {
    const pricePerNight = ACCOMMODATION_PRICES[accommodationType] || 0;
    console.log("Stay price per night:", pricePerNight);

    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      total = pricePerNight * Math.max(1, nights);
    } else {
      total = pricePerNight;
    }
  }

  console.log("Calculated total:", total);
  return total;
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ 
        error: "Quá nhiều yêu cầu. Vui lòng thử lại sau.", 
        retryAfter: Math.ceil(rateLimitResult.resetIn / 1000) 
      }),
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json", 
          "Retry-After": String(Math.ceil(rateLimitResult.resetIn / 1000)),
          ...corsHeaders 
        },
      }
    );
  }

  try {
    const rawData = await req.json();
    
    // Check honeypot field - if filled, it's likely a bot
    if (rawData.website && rawData.website.length > 0) {
      console.warn(`Honeypot triggered from IP: ${clientIp}`);
      // Return success to not alert the bot, but don't send email
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Validate input using zod schema
    const parseResult = bookingSchema.safeParse(rawData);
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Dữ liệu không hợp lệ", 
          details: parseResult.error.errors.map((e: any) => e.message) 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const bookingData: BookingRequest = parseResult.data;

    // Format date for display
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "Chưa xác định";
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Build package info section - use escapeHtml for user data
    let packageInfo = "";
    if (bookingData.packageName) {
      packageInfo = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Gói dịch vụ</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 500;">${escapeHtml(bookingData.packageName)} - ${escapeHtml(bookingData.packageSubtitle || "")}</td>
        </tr>
      `;
    }

    let accommodationInfo = "";
    if (bookingData.accommodationType) {
      accommodationInfo = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Loại lưu trú</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 500;">${escapeHtml(bookingData.accommodationType)}</td>
        </tr>
      `;
    }

    let bbqInfo = "";
    if (bookingData.addBBQ) {
      bbqInfo = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">BBQ lẩu nướng</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 500; color: #16a34a;">Có</td>
        </tr>
      `;
    }

    let notesInfo = "";
    if (bookingData.notes) {
      notesInfo = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Ghi chú</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${escapeHtml(bookingData.notes)}</td>
        </tr>
      `;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #15803d 0%, #22c55e 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌿 Đảo Xanh Ecofarm</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Thông báo đặt dịch vụ mới</p>
          </div>
          
          <!-- Booking Code -->
          <div style="background-color: #f0fdf4; padding: 25px; text-align: center; border-bottom: 3px solid #22c55e;">
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Mã đặt chỗ</p>
            <p style="margin: 0; color: #15803d; font-size: 32px; font-weight: bold; letter-spacing: 2px;">${escapeHtml(bookingData.bookingCode)}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Thông tin khách hàng</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666; width: 40%;">Họ tên</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #333;">${escapeHtml(bookingData.name)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Email</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
                  <a href="mailto:${escapeHtml(bookingData.email)}" style="color: #15803d; text-decoration: none;">${escapeHtml(bookingData.email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Số điện thoại</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
                  <a href="tel:${escapeHtml(bookingData.phone)}" style="color: #15803d; text-decoration: none; font-weight: 500;">${escapeHtml(bookingData.phone)}</a>
                </td>
              </tr>
            </table>
            
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Chi tiết đặt dịch vụ</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666; width: 40%;">Loại dịch vụ</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #15803d;">${escapeHtml(bookingData.serviceName)}</td>
              </tr>
              ${packageInfo}
              ${accommodationInfo}
              ${bbqInfo}
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Ngày bắt đầu</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 500;">${formatDate(bookingData.checkIn)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Ngày kết thúc</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 500;">${formatDate(bookingData.checkOut)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #666;">Số khách</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: 500;">
                  ${bookingData.adultsCount} người lớn${bookingData.childrenCount > 0 ? `, ${bookingData.childrenCount} trẻ em` : ""}
                </td>
              </tr>
              ${(() => {
                const totalPrice = calculateTotalPrice(bookingData);
                if (totalPrice > 0) {
                  return `
                    <tr style="background-color: #f0fdf4;">
                      <td style="padding: 16px 12px; color: #15803d; font-weight: 600; font-size: 16px;">💰 Tổng tiền</td>
                      <td style="padding: 16px 12px; font-weight: 700; color: #15803d; font-size: 18px;">${formatPrice(totalPrice)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 8px 12px; color: #666; font-size: 12px; font-style: italic;">
                        * Giá đã bao gồm 8% VAT và 5% phí dịch vụ
                      </td>
                    </tr>
                  `;
                }
                return "";
              })()}
              ${notesInfo}
            </table>
            
            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="tel:${escapeHtml(bookingData.phone)}" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📞 Gọi ngay cho khách
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              Email được gửi tự động từ hệ thống đặt dịch vụ Đảo Xanh Ecofarm
            </p>
            <p style="margin: 8px 0 0 0; color: #999; font-size: 11px;">
              Thôn Quỳnh Ngọc 1, Xã Ea Na, tỉnh ĐăkLăk | 0961 898 972 | daoxanh.com.vn
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend API directly
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["daoxanhecofarmdaklak@gmail.com"],
        subject: `[Đặt dịch vụ mới] ${escapeHtml(bookingData.bookingCode)} - ${escapeHtml(bookingData.name)}`,
        html: emailHtml,
      }),
    });

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-booking-notification function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

export default handler;
