'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      <FilterButton
        label="All"
        isActive={activeCategory === 'all'}
        onClick={() => onCategoryChange('all')}
      />
      {categories.map((category) => (
        <FilterButton
          key={category}
          label={category}
          isActive={activeCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300',
        isActive
          ? 'text-base'
          : 'text-secondary hover:text-ink'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="project-filter-indicator"
          className="absolute inset-0 bg-ink rounded-full"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
