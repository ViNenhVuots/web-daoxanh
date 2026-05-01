import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className,
  variant = 'default' 
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 text-sm font-medium rounded-full transition-colors",
          "hover:bg-primary/10",
          className
        )}
      >
        <span className={cn(
          "transition-opacity",
          language === 'vi' ? 'opacity-100' : 'opacity-50'
        )}>
          🇻🇳
        </span>
        <span className="text-muted-foreground">/</span>
        <span className={cn(
          "transition-opacity",
          language === 'en' ? 'opacity-100' : 'opacity-50'
        )}>
          🇬🇧
        </span>
      </button>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1 p-1 bg-muted rounded-full",
      className
    )}>
      <button
        onClick={() => setLanguage('vi')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all",
          language === 'vi' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span>🇻🇳</span>
        <span>VI</span>
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all",
          language === 'en' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
