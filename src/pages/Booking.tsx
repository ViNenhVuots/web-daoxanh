import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Check, ArrowRight, Package, Home, Tent, Building, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImage from "@/assets/hero-resort.jpg";

// 6 loại hình lưu trú - Accommodation options
const accommodationOptions = [
  {
    id: "lan-la-hanh-ngo",
    name: "Lán lá Hạnh Ngộ",
    description: "Cắm trại lều trong lán, view sông, gắn kết thiên nhiên",
    priceOriginal: 480000,
    priceDiscounted: 336000,
    unit: "lều/1 khách",
  },
  {
    id: "homestay-an-yen",
    name: "Homestay An Yên",
    description: "Nhà sàn, vách gỗ, mái cọ, view sông dưới tán dừa",
    priceOriginal: 1000000,
    priceDiscounted: 700000,
    unit: "1 phòng/2 khách",
  },
  {
    id: "bungalow-an-binh",
    name: "Bungalow An Bình",
    description: "Nhà gỗ độc đáo, view sông, yên tĩnh, sang trọng",
    priceOriginal: 1900000,
    priceDiscounted: 1330000,
    unit: "căn/2 khách",
  },
  {
    id: "nha-thanh-thoi",
    name: "Nhà Thảnh Thơi",
    description: "Family hotel, view vườn thoáng mát, 18-20 khách",
    priceOriginal: 1300000,
    priceDiscounted: 910000,
    unit: "1 phòng/2 khách",
  },
  {
    id: "nha-an-hoa",
    name: "Nhà An Hòa",
    description: "Phong cách tân cổ điển, tiện nghi, gần trung tâm",
    priceOriginal: 1300000,
    priceDiscounted: 910000,
    unit: "1 phòng/2 khách",
  },
  {
    id: "leu-se-re-pok",
    name: "Lều Sê Rê Pôk",
    description: "Glamping cao cấp, như khách sạn 4 sao, lãng mạn",
    priceOriginal: 1200000,
    priceDiscounted: 840000,
    unit: "lều/2 khách",
  },
];

// Combo 2 ngày 1 đêm packages
const comboPackages = [
  {
    id: "combo-a",
    name: "Gói A",
    subtitle: "Cắm trại glamping lều đơn tại lán lá Hạnh Ngộ",
    priceAdult: 454000,
    priceAdultOriginal: 649000,
    priceChild: 314000,
    priceChildOriginal: 449000,
    hasAccommodation: false,
  },
  {
    id: "combo-a1",
    name: "Gói A1",
    subtitle: "Tùy chọn lưu trú",
    priceAdult: 524000,
    priceAdultOriginal: 749000,
    priceChild: 384000,
    priceChildOriginal: 549000,
    hasAccommodation: true,
  },
  {
    id: "combo-a2",
    name: "Gói A2",
    subtitle: "Nhà gỗ Bungalow cao cấp An Bình",
    priceAdult: 734000,
    priceAdultOriginal: 1049000,
    priceChild: 594000,
    priceChildOriginal: 849000,
    hasAccommodation: false,
  },
];

// Trải nghiệm trong ngày packages - 5 gói riêng biệt
const dayTripPackages = [
  {
    id: "daytrip-a",
    name: "Gói A",
    subtitle: "Nông trại tiêu chuẩn",
    priceAdult: 84000,
    priceAdultOriginal: 120000,
    priceChild: 59000,
    priceChildOriginal: 85000,
  },
  {
    id: "daytrip-a1",
    name: "Gói A1",
    subtitle: "Nông trại 5 sao",
    priceAdult: 137000,
    priceAdultOriginal: null,
    priceChild: 112000,
    priceChildOriginal: null,
  },
  {
    id: "daytrip-a1-bbq",
    name: "Gói A1 BBQ",
    subtitle: "Nông trại 5 sao + BBQ lẩu nướng",
    priceAdult: 258000,
    priceAdultOriginal: null,
    priceChild: 209000,
    priceChildOriginal: null,
  },
  {
    id: "daytrip-a2",
    name: "Gói A2",
    subtitle: "Nông trại 5 sao+",
    priceAdult: 189000,
    priceAdultOriginal: null,
    priceChild: 165000,
    priceChildOriginal: null,
  },
  {
    id: "daytrip-a2-bbq",
    name: "Gói A2 BBQ",
    subtitle: "Nông trại 5 sao+ + BBQ lẩu nướng",
    priceAdult: 314000,
    priceAdultOriginal: null,
    priceChild: 265000,
    priceChildOriginal: null,
  },
];

const serviceTypes = [
  {
    id: "combo",
    name: "Combo 2 ngày 1 đêm",
    description: "Trọn gói nghỉ dưỡng và trải nghiệm nông trại",
    icon: Package,
  },
  {
    id: "day-trip",
    name: "Trải nghiệm trong ngày",
    description: "Khám phá nông trại và các hoạt động thú vị",
    icon: Tent,
  },
  { id: "stay", name: "Lưu trú", description: "Nghỉ dưỡng giữa thiên nhiên xanh mát", icon: Home },
  {
    id: "team-building",
    name: "Team Building / Hoạt động tập thể",
    description: "Tổ chức sự kiện và hoạt động nhóm",
    icon: Building,
  },
];

const generateBookingCode = () => {
  const randomNumbers = Math.floor(100000 + Math.random() * 900000);
  return `DXE${randomNumbers}`;
};

const Booking = () => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adultsCount: 2,
    childrenCount: 0,
    serviceType: "combo",
    packageId: "combo-a",
    accommodationType: "",
    addBBQ: false,
    name: "",
    email: "",
    phone: "",
    notes: "",
    website: "", // Honeypot field - should remain empty for human users
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookingCode = useMemo(() => generateBookingCode(), []);

  const selectedService = serviceTypes.find((s) => s.id === formData.serviceType);

  // Get packages based on service type
  const currentPackages =
    formData.serviceType === "combo" ? comboPackages : formData.serviceType === "day-trip" ? dayTripPackages : [];

  const selectedPackage = currentPackages.find((p) => p.id === formData.packageId);
  const selectedAccommodation = accommodationOptions.find((a) => a.id === formData.accommodationType);

  // Reset package selection when service type changes
  useEffect(() => {
    if (formData.serviceType === "combo") {
      setFormData((prev) => ({ ...prev, packageId: "combo-a", accommodationType: "", addBBQ: false }));
    } else if (formData.serviceType === "day-trip") {
      setFormData((prev) => ({ ...prev, packageId: "daytrip-a", accommodationType: "", addBBQ: false }));
    } else if (formData.serviceType === "stay") {
      setFormData((prev) => ({ ...prev, packageId: "", accommodationType: "", addBBQ: false }));
    } else {
      setFormData((prev) => ({ ...prev, packageId: "", accommodationType: "", addBBQ: false }));
    }
  }, [formData.serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email notification to ecofarm
      const { error } = await supabase.functions.invoke("send-booking-notification", {
        body: {
          bookingCode,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adultsCount: formData.adultsCount,
          childrenCount: formData.childrenCount,
          serviceType: formData.serviceType,
          serviceName: selectedService?.name || "",
          packageName: selectedPackage?.name,
          packageSubtitle: selectedPackage?.subtitle,
          packageId: formData.packageId,
          accommodationType: selectedAccommodation?.name,
          addBBQ: formData.addBBQ,
          notes: formData.notes,
          website: formData.website, // Honeypot field
        },
      });

      if (error) {
        console.error("Error sending notification:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
        setIsSubmitting(false);
        return;
      }

      toast.success("Đặt dịch vụ thành công!");
      setStep(3);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Calculate total price
  const calculateTotalPrice = useMemo(() => {
    let total = 0;
    const adultsCount = formData.adultsCount || 0;
    const childrenCount = formData.childrenCount || 0;

    if (formData.serviceType === "combo" && selectedPackage) {
      // Combo package pricing
      total += selectedPackage.priceAdult * adultsCount;
      total += selectedPackage.priceChild * childrenCount;

      // Add accommodation price for A1 if selected
      if (formData.packageId === "combo-a1" && selectedAccommodation) {
        total += selectedAccommodation.priceDiscounted;
      }
    } else if (formData.serviceType === "day-trip" && selectedPackage) {
      // Day trip pricing - giá đã bao gồm BBQ cho các gói BBQ
      total += selectedPackage.priceAdult * adultsCount;
      total += selectedPackage.priceChild * childrenCount;
    } else if (formData.serviceType === "stay" && selectedAccommodation) {
      // Stay pricing (per night)
      const checkIn = formData.checkIn ? new Date(formData.checkIn) : null;
      const checkOut = formData.checkOut ? new Date(formData.checkOut) : null;
      let nights = 1;
      if (checkIn && checkOut && checkOut > checkIn) {
        nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      }
      total += selectedAccommodation.priceDiscounted * nights;
    }

    return total;
  }, [formData, selectedPackage, selectedAccommodation]);

  // Check if can proceed to step 2
  const canProceed = () => {
    if (formData.serviceType === "team-building") {
      return true;
    }
    if (formData.serviceType === "stay") {
      return !!formData.accommodationType;
    }
    if (!formData.packageId) return false;

    // For combo A1, need accommodation selection
    if (formData.packageId === "combo-a1" && !formData.accommodationType) {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-20">
          <div className="absolute inset-0 h-[45vh]">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
          </div>

          <div className="container-wide relative pt-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <span className="label-elegant text-accent mb-5 block">Đặt dịch vụ</span>
              <h1 className="heading-hero text-primary-foreground mb-6">
                Lên kế hoạch <span className="italic">kỳ nghỉ</span>
              </h1>
              <div className="w-16 h-0.5 bg-accent mx-auto" />
            </motion.div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="pb-24 -mt-16 relative z-10">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mb-14">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-500 ${
                        step >= s ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > s ? <Check size={20} /> : s}
                    </div>
                    <span
                      className={`hidden sm:block text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {s === 1 ? "Chọn dịch vụ" : s === 2 ? "Thông tin" : "Xác nhận"}
                    </span>
                    {s < 3 && <div className="w-12 lg:w-16 h-0.5 bg-border" />}
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-3xl shadow-elevated overflow-hidden border border-border/50">
                {step === 1 && (
                  <div className="p-8 md:p-12 lg:p-14">
                    <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-10">
                      Chọn ngày & loại dịch vụ
                    </h2>

                    {/* Date and Guest Selection */}
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
                      <div className="space-y-3">
                        <Label htmlFor="checkIn" className="flex items-center gap-2 text-sm font-medium">
                          <Calendar size={16} className="text-primary" /> Ngày bắt đầu
                        </Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                          className="h-14"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="checkOut" className="flex items-center gap-2 text-sm font-medium">
                          <Calendar size={16} className="text-primary" /> Ngày kết thúc
                        </Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                          className="h-14"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="adults" className="flex items-center gap-2 text-sm font-medium">
                          <Users size={16} className="text-primary" /> Người lớn
                        </Label>
                        <Input
                          id="adults"
                          type="number"
                          min={1}
                          max={50}
                          value={formData.adultsCount}
                          onChange={(e) => setFormData({ ...formData, adultsCount: parseInt(e.target.value) || 1 })}
                          className="h-14"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="children" className="flex items-center gap-2 text-sm font-medium">
                          <Users size={16} className="text-primary" /> Trẻ em (5-12 tuổi)
                        </Label>
                        <Input
                          id="children"
                          type="number"
                          min={0}
                          max={50}
                          value={formData.childrenCount}
                          onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                          className="h-14"
                        />
                      </div>
                    </div>

                    {/* Service Type Selection */}
                    <div className="space-y-4 mb-10">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Package size={16} className="text-primary" /> Loại dịch vụ
                      </Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {serviceTypes.map((service) => {
                          const Icon = service.icon;
                          return (
                            <label
                              key={service.id}
                              className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.serviceType === service.id
                                  ? "border-primary bg-primary/5 shadow-soft"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="radio"
                                  name="serviceType"
                                  value={service.id}
                                  checked={formData.serviceType === service.id}
                                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                    formData.serviceType === service.id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <Icon size={20} />
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">{service.name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{service.description}</div>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Package Selection for Combo and Day Trip */}
                    <AnimatePresence mode="wait">
                      {(formData.serviceType === "combo" || formData.serviceType === "day-trip") && (
                        <motion.div
                          key={formData.serviceType}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 mb-10 overflow-hidden"
                        >
                          <Label className="flex items-center gap-2 text-sm font-medium">Chọn gói dịch vụ</Label>
                          <div className="grid gap-4">
                            {currentPackages.map((pkg) => (
                              <label
                                key={pkg.id}
                                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.packageId === pkg.id
                                    ? "border-primary bg-primary/5 shadow-soft"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-4">
                                    <input
                                      type="radio"
                                      name="packageId"
                                      value={pkg.id}
                                      checked={formData.packageId === pkg.id}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          packageId: e.target.value,
                                          accommodationType: "",
                                          addBBQ: false,
                                        })
                                      }
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                        formData.packageId === pkg.id ? "border-primary" : "border-border"
                                      }`}
                                    >
                                      {formData.packageId === pkg.id && (
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-primary">{pkg.name}</span>
                                        <span className="text-foreground font-medium">– {pkg.subtitle}</span>
                                      </div>
                                      {"hasAccommodation" in pkg && pkg.hasAccommodation && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Chọn loại phòng lưu trú bên dưới
                                        </p>
                                      )}
                                      {"hasBBQ" in pkg && pkg.hasBBQ && (
                                        <p className="text-xs text-muted-foreground mt-1">Có thể thêm BBQ lẩu nướng</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 justify-end">
                                        {pkg.priceAdultOriginal && (
                                          <span className="text-sm text-muted-foreground line-through">
                                            {formatPrice(pkg.priceAdultOriginal)}
                                          </span>
                                        )}
                                        <span className="font-semibold text-primary">
                                          {formatPrice(pkg.priceAdult)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">Người lớn</p>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                      <div className="flex items-center gap-2 justify-end">
                                        {pkg.priceChildOriginal && (
                                          <span className="text-sm text-muted-foreground line-through">
                                            {formatPrice(pkg.priceChildOriginal)}
                                          </span>
                                        )}
                                        <span className="font-medium text-foreground">
                                          {formatPrice(pkg.priceChild)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">Trẻ em</p>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Accommodation Selection for Combo A1 */}
                    <AnimatePresence>
                      {formData.packageId === "combo-a1" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 mb-10 overflow-hidden"
                        >
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <Home size={16} className="text-primary" /> Chọn loại phòng lưu trú
                          </Label>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {accommodationOptions.map((acc) => (
                              <label
                                key={acc.id}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.accommodationType === acc.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name="accommodationType"
                                    value={acc.id}
                                    checked={formData.accommodationType === acc.id}
                                    onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      formData.accommodationType === acc.id ? "border-primary" : "border-border"
                                    }`}
                                  >
                                    {formData.accommodationType === acc.id && (
                                      <div className="w-2 h-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{acc.name}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* BBQ is now included as separate packages - no checkbox needed */}

                    {/* Accommodation Selection for Stay Service */}
                    <AnimatePresence>
                      {formData.serviceType === "stay" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 mb-10 overflow-hidden"
                        >
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <Home size={16} className="text-primary" /> Chọn loại hình lưu trú
                          </Label>
                          <div className="grid gap-4">
                            {accommodationOptions.map((acc) => (
                              <label
                                key={acc.id}
                                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.accommodationType === acc.id
                                    ? "border-primary bg-primary/5 shadow-soft"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-4">
                                    <input
                                      type="radio"
                                      name="accommodationType"
                                      value={acc.id}
                                      checked={formData.accommodationType === acc.id}
                                      onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                        formData.accommodationType === acc.id ? "border-primary" : "border-border"
                                      }`}
                                    >
                                      {formData.accommodationType === acc.id && (
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-foreground">{acc.name}</div>
                                      <p className="text-xs text-muted-foreground mt-1">{acc.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="flex items-center gap-2 justify-end">
                                      <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(acc.priceOriginal)}
                                      </span>
                                      <span className="font-semibold text-primary">
                                        {formatPrice(acc.priceDiscounted)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{acc.unit}</p>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Note for Team Building */}
                    {formData.serviceType === "team-building" && (
                      <div className="bg-muted/50 rounded-xl p-5 mb-10">
                        <p className="text-sm text-muted-foreground">
                          Vui lòng liên hệ để được tư vấn gói Team Building phù hợp với quy mô và nhu cầu của nhóm.
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => setStep(2)}
                      size="lg"
                      className="w-full h-14 text-base"
                      disabled={!canProceed()}
                    >
                      Tiếp tục
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleSubmit} className="p-8 md:p-12 lg:p-14">
                    <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-10">
                      Thông tin liên hệ
                    </h2>

                    <div className="space-y-6 mb-10">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          required
                          className="h-14"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@example.com"
                            required
                            className="h-14"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Số điện thoại
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0912 345 678"
                            required
                            className="h-14"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Ghi chú (tùy chọn)
                        </Label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Yêu cầu đặc biệt..."
                          className="w-full h-28 px-4 py-4 rounded-xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>

                      {/* Honeypot field - hidden from users, only bots will fill it */}
                      <div className="absolute left-[-9999px] opacity-0 pointer-events-none" aria-hidden="true">
                        <Label htmlFor="website">Website (để trống)</Label>
                        <Input
                          type="text"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-muted/50 rounded-2xl p-6 lg:p-8 mb-10">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-5">Tóm tắt đặt dịch vụ</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loại dịch vụ</span>
                          <span className="text-foreground font-medium">{selectedService?.name}</span>
                        </div>
                        {selectedPackage && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gói</span>
                            <span className="text-foreground font-medium">
                              {selectedPackage.name} – {selectedPackage.subtitle}
                            </span>
                          </div>
                        )}
                        {formData.accommodationType && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Loại phòng</span>
                            <span className="text-foreground">
                              {accommodationOptions.find((a) => a.id === formData.accommodationType)?.name}
                            </span>
                          </div>
                        )}
                        {formData.addBBQ && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">BBQ lẩu nướng</span>
                            <span className="text-foreground">Có</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày bắt đầu</span>
                          <span className="text-foreground">{formData.checkIn || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày kết thúc</span>
                          <span className="text-foreground">{formData.checkOut || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số khách</span>
                          <span className="text-foreground">
                            {formData.adultsCount} người lớn, {formData.childrenCount} trẻ em
                          </span>
                        </div>

                        {/* Total Price */}
                        {formData.serviceType !== "team-building" && calculateTotalPrice > 0 && (
                          <>
                            <div className="h-px bg-border my-4" />
                            <div className="flex justify-between items-center">
                              <span className="text-foreground font-semibold">Tổng cộng (tạm tính)</span>
                              <span className="text-xl font-serif font-bold text-primary">
                                {formatPrice(calculateTotalPrice)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              * Giá đã bao gồm 8% VAT và 5% phí dịch vụ.
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        size="lg"
                        className="flex-1 h-14"
                        disabled={isSubmitting}
                      >
                        Quay lại
                      </Button>
                      <Button type="submit" variant="default" size="lg" className="flex-1 h-14 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Xác nhận đặt dịch vụ"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <div className="p-8 md:p-12 lg:p-16 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-8"
                    >
                      <Check size={48} className="text-secondary-foreground" />
                    </motion.div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-5">
                      Đặt dịch vụ thành công!
                    </h2>
                    <p className="body-regular text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                      Đảo Xanh Ecofarm đã sẵn sàng phục vụ quý khách,
                      <br />
                      chúc quý khách có những trải nghiệm tuyệt vời!
                    </p>
                    <div className="bg-primary/10 rounded-2xl p-8 mb-8 max-w-sm mx-auto">
                      <p className="text-sm text-muted-foreground mb-3">Mã đặt chỗ</p>
                      <p className="font-serif text-3xl font-bold text-primary">{bookingCode}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">
                      Vui lòng kiểm tra Zalo để nhận xác nhận đặt thành công và thanh toán giữ chỗ.
                    </p>
                    <Button>
                      <a href="/">Về trang chủ</a>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
