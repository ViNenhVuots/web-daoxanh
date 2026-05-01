import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo-dao-xanh.png";

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialLinks = [
  { href: "https://www.facebook.com/daoxanh.com.vn", icon: <Facebook size={18} />, label: "Facebook" },
  {
    href: "https://www.instagram.com/daoxanh_ecofarm?igsh=NjUwc3VveHgxYmYz",
    icon: <Instagram size={18} />,
    label: "Instagram",
  },
  { href: "https://www.youtube.com/@daoxanhecofarm", icon: <Youtube size={18} />, label: "Youtube" },
  {
    href: "https://www.tiktok.com/@daoxanhecofarmdaklak?_r=1&_t=ZS-93AmSmWMBRF",
    icon: <TikTokIcon />,
    label: "TikTok",
  },
];

export function Footer() {
  const { t } = useLanguage();

  const exploreLinks = [
    { href: "/gioi-thieu", label: t.footer.explore.about },
    { href: "/dich-vu", label: t.footer.explore.services },
    { href: "/thu-vien", label: t.footer.explore.gallery },
    { href: "/tin-tuc", label: t.footer.explore.blog },
  ];

  const serviceLinks = [
    { href: "/dich-vu#luu-tru", label: t.footer.servicesMenu.accommodation },
    { href: "/dich-vu#trai-nghiem", label: t.footer.servicesMenu.farming },
    { href: "/dich-vu#am-thuc", label: t.footer.servicesMenu.cuisine },
    { href: "/dich-vu#team-building", label: t.footer.servicesMenu.activities },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="container-wide py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-2">{t.footer.cta.title}</h3>
              <p className="text-primary-foreground/70">{t.footer.cta.description}</p>
            </div>
            <Link to="/dat-phong">
              <Button variant="default" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {t.footer.cta.bookNow}
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-14 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand - Takes more space */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Đảo Xanh Resort" className="h-14 md:h-16 w-auto brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed mb-8 max-w-md">{t.footer.description}</p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <a
                href="tel:0961898972"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone size={18} className="text-accent" />
                </div>
                <span className="font-medium">096 189 89 72</span>
              </a>
              <a
                href="mailto:daoxanhecofarmdaklak@gmail.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Mail size={18} className="text-accent" />
                </div>
                <span>daoxanhecofarmdaklak@gmail.com</span>
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-accent" />
                </div>
                <span className="pt-2">Thôn Quỳnh Ngọc 1, Xã Ea Na, Tỉnh Đắk Lắk</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
              {/* Explore */}
              <div>
                <h4 className="font-serif text-lg font-semibold mb-5 text-primary-foreground">
                  {t.footer.explore.title}
                </h4>
                <ul className="space-y-3">
                  {exploreLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-primary-foreground/70 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-serif text-lg font-semibold mb-5 text-primary-foreground">
                  {t.footer.servicesMenu.title}
                </h4>
                <ul className="space-y-3">
                  {serviceLinks.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opening Hours */}
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-serif text-lg font-semibold mb-5 text-primary-foreground">
                  {t.footer.hours.title}
                </h4>
                <div className="space-y-3 text-primary-foreground/70">
                  <div>
                    <p className="font-medium text-primary-foreground">{t.footer.hours.checkIn}</p>
                    <p>14:00</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary-foreground">{t.footer.hours.checkOut}</p>
                    <p>12:00</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary-foreground">{t.footer.hours.reception}</p>
                    <p>24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm text-center sm:text-left">
            © 2026 Đảo Xanh Ecofarm. {t.footer.allRights}
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/admin" className="text-primary-foreground/50 hover:text-accent transition-colors">
              {t.footer.admin}
            </Link>
            <Link to="/dieu-khoan" className="text-primary-foreground/50 hover:text-accent transition-colors">
              {t.footer.terms}
            </Link>
            <Link to="/bao-mat" className="text-primary-foreground/50 hover:text-accent transition-colors">
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
