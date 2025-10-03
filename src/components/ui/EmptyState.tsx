"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/amal-ui';
import { cn } from '@/amal-ui';
import { 
  FileX, 
  Search, 
  Plus, 
  RefreshCw, 
  Image as ImageIcon,
  Database,
  Users,
  Package,
  MessageSquare,
  Briefcase
} from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const defaultIcons = {
  default: FileX,
  search: Search,
  add: Plus,
  refresh: RefreshCw,
  image: ImageIcon,
  database: Database,
  users: Users,
  package: Package,
  message: MessageSquare,
  briefcase: Briefcase,
};

export function EmptyState({
  title = "No data found",
  description = "There are no items to display at the moment.",
  icon,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        currentSize.container,
        className
      )}
    >
      <div className={cn('flex flex-col items-center', currentSize.spacing)}>
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={cn(
            'text-gray-400 dark:text-gray-600',
            currentSize.icon
          )}
        >
          {icon || <defaultIcons.default className="w-full h-full" />}
        </motion.div>

        {/* Content */}
        <div className="max-w-md">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn(
              'font-semibold text-gray-900 dark:text-gray-100 mb-2',
              currentSize.title
            )}
          >
            {title}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={cn(
              'text-gray-500 dark:text-gray-400',
              currentSize.description
            )}
          >
            {description}
          </motion.p>
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mt-6"
          >
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || 'primary'}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || 'outline'}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                {secondaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Pre-built empty states for common scenarios
export function EmptyTableState({
  entityName = "items",
  onAdd,
  onRefresh,
  className,
}: {
  entityName?: string;
  onAdd?: () => void;
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={`No ${entityName} found`}
      description={`There are no ${entityName} to display. Start by adding your first ${entityName.slice(0, -1)}.`}
      icon={<Database className="w-full h-full" />}
      action={onAdd ? { label: `Add ${entityName.slice(0, -1)}`, onClick: onAdd } : undefined}
      secondaryAction={onRefresh ? { label: 'Refresh', onClick: onRefresh } : undefined}
      className={className}
    />
  );
}

export function EmptySearchState({
  searchTerm,
  onClear,
  className,
}: {
  searchTerm?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No results found"
      description={searchTerm ? `No results found for "${searchTerm}". Try adjusting your search terms.` : "No results found for your search."}
      icon={<Search className="w-full h-full" />}
      action={onClear ? { label: 'Clear search', onClick: onClear, variant: 'outline' } : undefined}
      className={className}
    />
  );
}

export function EmptyImagesState({
  onUpload,
  className,
}: {
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No images uploaded"
      description="Upload your first image to get started. You can upload multiple images at once."
      icon={<ImageIcon className="w-full h-full" />}
      action={onUpload ? { label: 'Upload images', onClick: onUpload } : undefined}
      className={className}
    />
  );
}

export function EmptyUsersState({
  onInvite,
  className,
}: {
  onInvite?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No users found"
      description="Invite team members to collaborate and manage your workspace together."
      icon={<Users className="w-full h-full" />}
      action={onInvite ? { label: 'Invite users', onClick: onInvite } : undefined}
      className={className}
    />
  );
}

export function EmptyProductsState({
  onAdd,
  className,
}: {
  onAdd?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No products found"
      description="Add your first product to start showcasing your offerings to customers."
      icon={<Package className="w-full h-full" />}
      action={onAdd ? { label: 'Add product', onClick: onAdd } : undefined}
      className={className}
    />
  );
}

export function EmptyTestimonialsState({
  onAdd,
  className,
}: {
  onAdd?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No testimonials found"
      description="Add customer testimonials to build trust and showcase your success stories."
      icon={<MessageSquare className="w-full h-full" />}
      action={onAdd ? { label: 'Add testimonial', onClick: onAdd } : undefined}
      className={className}
    />
  );
}

export function EmptyApplicationsState({
  onRefresh,
  className,
}: {
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No applications found"
      description="Job applications will appear here once candidates start applying to your positions."
      icon={<Briefcase className="w-full h-full" />}
      action={onRefresh ? { label: 'Refresh', onClick: onRefresh, variant: 'outline' } : undefined}
      className={className}
    />
  );
}
