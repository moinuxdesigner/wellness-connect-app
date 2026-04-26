import { InputHTMLAttributes, forwardRef } from 'react';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="6" />
            <path d="M12.5 12.5L17 17" strokeLinecap="round" />
          </svg>
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          className={`
            w-full h-11 pl-10 pr-10 rounded-md
            bg-input-background border border-border-default
            text-text-primary placeholder:text-text-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent
            ${className}
          `}
          {...props}
        />
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-text-muted hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
            type="button"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4L12 12M12 4L4 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
