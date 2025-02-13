import React from "react";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface Suggestion {
  id: string | number;
  value: string;
}

export type SearchBarVariant = "default" | "minimal" | "bordered";
export type SearchBarSize = "sm" | "md" | "lg";

export interface SearchBarProps {
  className?: string;
  // Core functionality
  alwaysOpen?: boolean;
  autoComplete?: boolean;
  suggestions?: Suggestion[];
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;
  // Styling options
  variant?: SearchBarVariant;
  size?: SearchBarSize;
  placeholder?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  suggestionHighlightColor?: string;
  // Animation options
  disableAnimations?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
  // Behavior
  clearOnSelect?: boolean;
  closeOnSelect?: boolean;
  maxSuggestions?: number;
}

const SearchBar = ({
  className,
  alwaysOpen = false,
  autoComplete = false,
  suggestions = [],
  onSelect,
  onChange,
  // New props with defaults
  variant = "default",
  size = "md",
  placeholder = "Search...",
  borderColor = "border-teal-600",
  backgroundColor = "bg-white",
  textColor = "text-black",
  iconColor,
  suggestionHighlightColor = "bg-gray-100",
  disableAnimations = false,
  springConfig = {
    stiffness: 700,
    damping: 50,
  },
  clearOnSelect = false,
  closeOnSelect = false,
  maxSuggestions = 6,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = React.useState(alwaysOpen ?? false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isTyping, setIsTyping] = React.useState(false);
  const selectedRef = React.useRef<HTMLDivElement>(null);
  const uniqueId = React.useId(); // Generate a unique ID for each instance
  const typingTimeoutRef = React.useRef<number>();

  React.useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleClick = () => {
    if (alwaysOpen) return;
    setIsOpen((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    onChange?.(value);
    
    // Set typing state with longer duration
    setIsTyping(true);
    window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 300);
  };

  const handleSelect = (value: string) => {
    if (clearOnSelect) {
      setQuery("");
    } else {
      setQuery(value);
    }
    setSelectedIndex(-1);
    onSelect?.(value);
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredLength = filteredSuggestions.length;
    
    if (!filteredLength) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredLength);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredLength) % filteredLength);
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          const value = filteredSuggestions[selectedIndex].value;
          handleSelect(value);
        }
        break;
      case "Escape":
        setSelectedIndex(-1);
        break;
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "text-sm py-2",
    md: "text-base py-3",
    lg: "text-lg py-4"
  };

  // Variant classes
  const variantClasses = {
    default: `border-4 ${borderColor}`,
    minimal: "border-0 shadow-lg",
    bordered: `border-2 ${borderColor}`
  };

  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.value.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxSuggestions);

  const showSuggestions = autoComplete && isOpen && query && filteredSuggestions.length > 0;

  const scale = isTyping ? 0.99 : (isOpen ? 1.01 : 1);

  return (
    <div className="relative w-full" style={{ minHeight: sizeClasses[size] }}>
      <div className="w-fit">
        <motion.div
          layoutId={`searchbar-${uniqueId}`}
          animate={!disableAnimations ? { scale } : {}}
          style={{
            transformOrigin: "left center",
            willChange: "transform"
          }}
          transition={{
            scale: { 
              type: "spring", 
              stiffness: springConfig.stiffness, 
              damping: springConfig.damping 
            },
            layout: { duration: 0.2 }
          }}
        >
          <div className={cn(
            variantClasses[variant],
            backgroundColor,
            "transition-[border-radius] duration-300 ease-out",
            showSuggestions 
              ? "rounded-t-[24px]" 
              : "rounded-[24px]",
            className
          )}>
            <div className={cn(
              "flex items-center transition-[padding] duration-300",
              isOpen ? "pr-4" : "pr-0"
            )}>
              <motion.div
                animate={!disableAnimations ? { 
                  scale: isOpen ? 0.9 : 1,
                  rotate: isOpen ? 360 : 0
                } : {}}
                transition={{
                  scale: { type: "spring", stiffness: springConfig.stiffness, damping: springConfig.damping },
                  rotate: { type: "spring", stiffness: 200, damping: 20 }
                }}
                className="flex items-center"
              >
                <Search
                  className={cn("h-5 w-5 font-bold m-3 transition-colors duration-300", {
                    [iconColor || "text-gray-500"]: isOpen,
                    [iconColor || "text-teal-600"]: !isOpen,
                    "cursor-pointer": !alwaysOpen,
                  })}
                  onClick={handleClick}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div 
                    initial={!disableAnimations ? { width: 0 } : undefined}
                    animate={!disableAnimations ? { 
                      width: size === "sm" ? 150 : size === "lg" ? 250 : 200,
                    } : undefined}
                    exit={!disableAnimations ? { width: 0 } : undefined}
                    transition={{
                      type: "spring",
                      stiffness: springConfig.stiffness,
                      damping: springConfig.damping,
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.div
                      initial={!disableAnimations ? { opacity: 0 } : undefined}
                      animate={!disableAnimations ? { opacity: 1 } : undefined}
                      exit={!disableAnimations ? { opacity: 0 } : undefined}
                    >
                      <input
                        type="text"
                        className={cn(
                          backgroundColor,
                          textColor,
                          sizeClasses[size],
                          "outline-none focus:outline-none focus:ring-0 w-full pl-2"
                        )}
                        value={query}
                        placeholder={placeholder}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={{ WebkitAppearance: "none" }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={!disableAnimations ? { height: 0, opacity: 0 } : undefined}
                  animate={!disableAnimations ? { 
                    height: filteredSuggestions.length * (size === "sm" ? 36 : size === "lg" ? 52 : 44), 
                    opacity: 1
                  } : undefined}
                  exit={!disableAnimations ? { height: 0, opacity: 0 } : undefined}
                  className="w-full"
                  style={{ overflow: "hidden" }}
                >
                  <div 
                    className={cn(
                      "p-0 m-0 scrollbar-none",
                      backgroundColor
                    )}
                    style={{
                      maxHeight: Math.min(filteredSuggestions.length * (size === "sm" ? 36 : size === "lg" ? 52 : 44), 250),
                      overscrollBehavior: "contain",
                      scrollbarGutter: "stable"
                    }}
                  >
                    {filteredSuggestions.map((suggestion, index) => (
                      <div 
                        ref={index === selectedIndex ? selectedRef : null}
                        key={suggestion.id} 
                        className={cn(
                          "p-3 hover:bg-gray-100 cursor-pointer transition-colors",
                          textColor,
                          sizeClasses[size],
                          { [suggestionHighlightColor]: index === selectedIndex }
                        )}
                        onClick={() => handleSelect(suggestion.value)}
                      >
                        {suggestion.value}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchBar;
