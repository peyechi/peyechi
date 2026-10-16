import React from 'react';
import {
  FileText,
  Smartphone,
  Briefcase,
  Key,
  Dog,
  Watch,
  CreditCard,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'DOCUMENTS':
      return <FileText className={className} />;
    case 'ELECTRONICS':
      return <Smartphone className={className} />;
    case 'BAGS_WALLETS':
      return <Briefcase className={className} />;
    case 'KEYS':
      return <Key className={className} />;
    case 'PETS':
      return <Dog className={className} />;
    case 'JEWELRY':
      return <Watch className={className} />;
    case 'CARDS_MONEY':
      return <CreditCard className={className} />;
    case 'BOOKS_STATIONERY':
      return <BookOpen className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
