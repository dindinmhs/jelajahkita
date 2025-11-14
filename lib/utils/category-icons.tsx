import {
  UtensilsCrossed,
  Shirt,
  Wrench,
  Briefcase,
  Sprout,
  Laptop,
  Store,
} from "lucide-react";

export const getCategoryIcon = (category: string, size: number = 20) => {
  const categoryLower = category.toLowerCase();

  switch (categoryLower) {
    case "kuliner":
      return <UtensilsCrossed size={size} />;
    case "fashion":
      return <Shirt size={size} />;
    case "kerajinan":
      return <Wrench size={size} />;
    case "jasa":
      return <Briefcase size={size} />;
    case "pertanian":
      return <Sprout size={size} />;
    case "teknologi":
      return <Laptop size={size} />;
    default:
      return <Store size={size} />;
  }
};

export const getCategoryColor = (category: string) => {
  const categoryLower = category.toLowerCase();

  switch (categoryLower) {
    case "kuliner":
      return "#FF6B35";
    case "fashion":
      return "#E91E63";
    case "kerajinan":
      return "#9C27B0";
    case "jasa":
      return "#2196F3";
    case "pertanian":
      return "#4CAF50";
    case "teknologi":
      return "#607D8B";
    default:
      return "#FF6B35";
  }
};