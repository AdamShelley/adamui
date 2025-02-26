import React from "react";
import { cn } from "../../lib/utils";
import { Search, X } from "lucide-react";
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
  showClear?: boolean;
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
  // disableAnimations?: boolean;
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
  showClear = true,
  onSelect,
  onChange,
  variant = "default",
  size = "md",
  placeholder = "Search...",
  borderColor = "border-transparent",
  backgroundColor = "bg-white",
  textColor = "text-black",
  iconColor,
  suggestionHighlightColor = "bg-gray-100",
  springConfig = {
    stiffness: 700,
    damping: 50,
  },
  clearOnSelect = false,
  closeOnSelect = false,
  maxSuggestions = 4,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = React.useState(alwaysOpen ?? false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isTyping, setIsTyping] = React.useState(false);
  const selectedRef = React.useRef<HTMLDivElement>(null);
  const uniqueId = React.useId();
  const typingTimeoutRef = React.useRef<number>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fixedHeightMap = {
    sm: 40,
    md: 48,
    lg: 56,
  };

  React.useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus the input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleClick = () => {
    if (alwaysOpen) return;
    setIsOpen((prev: boolean) => !prev);
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
    // if (e.key === "Enter") {
    //   if (selectedIndex >= 0 && filteredSuggestions.length > 0) {
    //     const value = filteredSuggestions[selectedIndex].value;
    //     handleSelect(value);
    //   } else if (query) {
    //     // Trigger success animation
    //     setShowSuccess(true);
    //     setTimeout(() => setShowSuccess(false), 1500);

    //     // onSearch?.(query);
    //   }
    //   return;
    // }

    const filteredLength = filteredSuggestions.length;

    if (!filteredLength) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev: number) => (prev + 1) % filteredLength);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev: number) => (prev - 1 + filteredLength) % filteredLength
        );
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          const value = filteredSuggestions[selectedIndex].value;
          handleSelect(value);
        }
        break;
      case "Escape":
        setSelectedIndex(-1);
        setIsOpen(false);
        break;
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Variant classes
  const variantClasses = {
    default: `border-4 ${borderColor}`,
    minimal: "border-0 shadow-lg",
    bordered: `border-2 ${borderColor}`,
  };

  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.value.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxSuggestions);

  const showSuggestions =
    autoComplete && isOpen && query && filteredSuggestions.length > 0;

  const scale = isTyping ? 0.99 : isOpen ? 1.01 : 1;

  // Width values for different sizes
  const inputWidthValues = {
    sm: 150,
    md: 200,
    lg: 250,
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    onChange?.("");
  };

  return (
    <div className="relative" style={{ width: inputWidthValues[size] }}>
      <div className="w-fit">
        <motion.div
          layoutId={`searchbar-${uniqueId}`}
          animate={{
            scale,
          }}
          transition={{
            scale: {
              type: "spring",
              stiffness: springConfig.stiffness,
              damping: springConfig.damping,
            },

            layout: { duration: 0.2 },
          }}
          style={{
            transformOrigin: "left center",
            willChange: "transform",
          }}
        >
          <div
            className={cn(
              variantClasses[variant],
              backgroundColor,
              "transition-[border-radius] duration-300 ease-out rounded-[24px] overflow-hidden",
              className
            )}
          >
            <div
              className={cn(
                "flex items-center relative",
                // Fixed height to prevent layout shifts
                "h-full"
              )}
              // Use a fixed height based on size to maintain consistency
              style={{ height: fixedHeightMap[size] }}
            >
              <motion.div
                animate={{
                  scale: isOpen ? 0.9 : 1,
                  rotate: isOpen ? 360 : 0,
                }}
                transition={{
                  scale: {
                    type: "spring",
                    stiffness: springConfig.stiffness,
                    damping: springConfig.damping,
                  },
                  rotate: { type: "spring", stiffness: 200, damping: 20 },
                }}
                className="flex items-center h-full"
              >
                <Search
                  className={cn(
                    "h-5 w-5 font-bold mx-3 transition-colors duration-300",
                    {
                      [iconColor || "text-gray-500"]: isOpen,
                      [iconColor || "text-teal-600"]: !isOpen,
                      "cursor-pointer": !alwaysOpen,
                    }
                  )}
                  onClick={handleClick}
                />
              </motion.div>

              {/* This is a placeholder div that maintains space when input is not shown */}
              {!isOpen && (
                <div style={{ width: 0, height: fixedHeightMap[size] }} />
              )}

              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: inputWidthValues[size] }}
                    exit={{ width: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: springConfig.stiffness,
                      damping: springConfig.damping,
                    }}
                    style={{
                      overflow: "hidden",
                      height: fixedHeightMap[size],
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        className={cn(
                          backgroundColor,
                          textColor,
                          sizeClasses[size],
                          "outline-none focus:outline-none focus:ring-0 w-full pl-2 pr-8 h-full"
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

              <AnimatePresence>
                {isOpen && query && showClear && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <button
                      type="button"
                      className={cn(
                        "p-1 rounded-full hover:bg-gray-200  transition-colors",
                        iconColor || "text-gray-500"
                      )}
                      onClick={handleClear}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height:
                      filteredSuggestions.length *
                      (size === "sm" ? 36 : size === "lg" ? 52 : 44),
                    opacity: 1,
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full overflow-hidden"
                >
                  <div
                    className={cn(
                      "p-0 m-0",
                      backgroundColor,
                      "overflow-hidden"
                    )}
                    style={{
                      maxHeight: Math.min(
                        filteredSuggestions.length *
                          (size === "sm" ? 36 : size === "lg" ? 52 : 44),
                        250
                      ),
                      borderBottomLeftRadius: "24px",
                      borderBottomRightRadius: "24px",
                    }}
                  >
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        ref={index === selectedIndex ? selectedRef : null}
                        key={suggestion.id}
                        className={cn(
                          "p-3 cursor-pointer transition-colors group ",
                          textColor,
                          sizeClasses[size],
                          {
                            [suggestionHighlightColor]: index === selectedIndex,
                            [`hover:${suggestionHighlightColor}`]: true,
                          }
                        )}
                        onClick={() => handleSelect(suggestion.value)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onMouseLeave={() => setSelectedIndex(-1)}
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
