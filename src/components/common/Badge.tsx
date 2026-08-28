import React from 'react';
import { OrderStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'teal' | 'blue' | 'amber' | 'green' | 'red' | 'gray' | 'purple';
  status?: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'teal',
  status,
  size = 'md',
  className = '',
}) => {
  let computedVariant = variant;
  let label = children;

  if (status) {
    switch (status) {
      case 'ORDER_PLACED':
        computedVariant = 'gray';
        label = label || 'Order Placed';
        break;
      case 'PICKUP_ASSIGNED':
      case 'PICKED_UP':
        computedVariant = 'blue';
        label = label || (status === 'PICKUP_ASSIGNED' ? 'Pickup Assigned' : 'Picked Up');
        break;
      case 'RECEIVED_AT_FACILITY':
      case 'WEIGHED_VERIFIED':
        computedVariant = 'teal';
        label = label || (status === 'RECEIVED_AT_FACILITY' ? 'At Facility' : 'Weighed & Confirmed');
        break;
      case 'WASHING':
      case 'DRYING':
      case 'IRONING':
      case 'QUALITY_CHECK':
      case 'PACKED':
        computedVariant = 'amber';
        label = label || status.replace('_', ' ');
        break;
      case 'DELIVERY_ASSIGNED':
      case 'OUT_FOR_DELIVERY':
        computedVariant = 'blue';
        label = label || (status === 'DELIVERY_ASSIGNED' ? 'Delivery Assigned' : 'Out for Delivery');
        break;
      case 'DELIVERED':
      case 'COMPLETED':
        computedVariant = 'green';
        label = label || (status === 'DELIVERED' ? 'Delivered' : 'Completed');
        break;
      case 'CANCELLED':
        computedVariant = 'red';
        label = label || 'Cancelled';
        break;
      default:
        computedVariant = 'gray';
    }
  }

  const variantStyles: Record<string, string> = {
    teal: 'bg-[#F7F0F2] text-[#5B214F] border-indigo-200/80 font-bold',
    blue: 'bg-indigo-50 text-indigo-800 border-indigo-200/80 font-bold',
    amber: 'bg-amber-50 text-amber-900 border-amber-200/80 font-bold',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold',
    red: 'bg-rose-50 text-rose-800 border-rose-200/80 font-bold',
    gray: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
    purple: 'bg-[#F7F0F2] text-[#5B214F] border-indigo-200/80 font-bold',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs tracking-wide ${variantStyles[computedVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {label}
    </span>
  );
};
