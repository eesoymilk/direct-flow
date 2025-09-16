/**
 * Design system composable that provides consistent theming
 * between Nuxt UI and PrimeVue components
 */

export const useDesignSystem = () => {
  // Shared color tokens that work with both UI libraries
  const colors = {
    primary: {
      50: 'oklch(0.97 0.02 240)',
      100: 'oklch(0.92 0.03 240)',
      200: 'oklch(0.85 0.05 240)',
      300: 'oklch(0.78 0.07 240)',
      400: 'oklch(0.71 0.09 240)',
      500: 'oklch(0.64 0.11 240)',
      600: 'oklch(0.57 0.13 240)',
      700: 'oklch(0.5 0.15 240)',
      800: 'oklch(0.43 0.17 240)',
      900: 'oklch(0.36 0.19 240)',
      950: 'oklch(0.25 0.21 240)'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    }
  }

  // Common component styling patterns
  const components = {
    button: {
      borderRadius: 'rounded-lg',
      padding: {
        sm: 'px-3 py-2',
        md: 'px-4 py-2.5',
        lg: 'px-5 py-3'
      }
    },
    card: {
      borderRadius: 'rounded-lg',
      padding: 'p-6',
      shadow: 'shadow-sm'
    },
    input: {
      borderRadius: 'rounded-lg',
      padding: 'px-3 py-2.5'
    }
  }

  // Utility functions for consistent styling
  const getButtonClasses = (variant: 'primary' | 'secondary' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const baseClasses = `inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${components.button.borderRadius} ${components.button.padding[size]}`

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500'
    }

    return `${baseClasses} ${variantClasses[variant]}`
  }

  const getCardClasses = () => {
    return `bg-white border border-gray-200 ${components.card.borderRadius} ${components.card.shadow} ${components.card.padding}`
  }

  const getInputClasses = () => {
    return `w-full border border-gray-300 ${components.input.borderRadius} ${components.input.padding} text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500`
  }

  return {
    colors,
    components,
    getButtonClasses,
    getCardClasses,
    getInputClasses
  }
}