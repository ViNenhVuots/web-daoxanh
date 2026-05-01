import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo-dao-xanh.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/gioi-thieu", label: t.nav.about },
    { href: "/dich-vu", label: t.nav.services },
    { href: "/thu-vien", label: t.nav.gallery },
    { href: "/tin-tuc", label: t.nav.blog },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/98 backdrop-blur-lg shadow-md py-2"
            : "bg-gradient-to-b from-black/40 to-transparent py-4"
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img
                src={logo}
                alt="Đảo Xanh Ecofarm"
                className={`h-12 lg:h-14 w-auto transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`}
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full px-2 py-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${
                      isScrolled
                        ? location.pathname === link.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:text-primary hover:bg-muted"
                        : location.pathname === link.href
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Language Switcher */}
              <div className={isScrolled ? "" : "[&_button]:text-white [&_span]:text-white/60"}>
                <LanguageSwitcher variant="minimal" />
              </div>

              {/* Phone - Desktop only */}
              <a
                href="tel:0961898972"
                className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "text-foreground/70 hover:text-primary hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Phone size={16} />
                <span className="font-medium text-sm">096 189 89 72</span>
              </a>

              {/* CTA Button */}
              <Link to="/dat-phong" className="hidden sm:block">
                <Button variant="default" size="default" className="rounded-full px-6">
                  {t.nav.booking}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-full transition-colors ${
                  isScrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
                }`}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <img src={logo} alt="Đảo Xanh" className="h-10" />
                <div className="flex items-center gap-2">
                  <LanguageSwitcher variant="minimal" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Mobile Links */}
              <div className="p-6">
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className={`flex items-center justify-between px-4 py-4 text-lg font-serif transition-all rounded-xl ${
                          location.pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                        {location.pathname === link.href && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.15 }}
                  className="mt-8 pt-6 border-t border-border space-y-4"
                >
                  <Link to="/dat-phong" className="block">
                    <Button variant="default" size="lg" className="w-full rounded-xl h-14">
                      {t.nav.booking}
                    </Button>
                  </Link>
                  <a
                    href="tel:0961898972"
                    className="flex items-center justify-center gap-3 py-4 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    <span className="font-medium">096 189 89 72</span>
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
