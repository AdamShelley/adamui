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
  variant = "default",
  size = "md",
  placeholder = "Search...",
  borderColor = "border-transparent",
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

  // Calculate the fixed height based on size
  const fixedHeightMap = {
    sm: 40, // px
    md: 48, // px
    lg: 56, // px
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

  return (
    <div className="relative w-full">
      <div className="w-fit">
        <motion.div
          layoutId={`searchbar-${uniqueId}`}
          animate={!disableAnimations ? { scale } : {}}
          style={{
            transformOrigin: "left center",
            willChange: "transform",
          }}
          transition={{
            scale: {
              type: "spring",
              stiffness: springConfig.stiffness,
              damping: springConfig.damping,
            },
            layout: { duration: 0.2 },
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
                "flex items-center",
                // Fixed height to prevent layout shifts
                "h-full"
              )}
              // Use a fixed height based on size to maintain consistency
              style={{ height: fixedHeightMap[size] }}
            >
              <motion.div
                animate={
                  !disableAnimations
                    ? {
                        scale: isOpen ? 0.9 : 1,
                        rotate: isOpen ? 360 : 0,
                      }
                    : {}
                }
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
                    initial={!disableAnimations ? { width: 0 } : undefined}
                    animate={
                      !disableAnimations
                        ? { width: inputWidthValues[size] }
                        : undefined
                    }
                    exit={!disableAnimations ? { width: 0 } : undefined}
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
                      initial={!disableAnimations ? { opacity: 0 } : undefined}
                      animate={!disableAnimations ? { opacity: 1 } : undefined}
                      exit={!disableAnimations ? { opacity: 0 } : undefined}
                      className="w-full h-full flex items-center"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        className={cn(
                          backgroundColor,
                          textColor,
                          sizeClasses[size],
                          "outline-none focus:outline-none focus:ring-0 w-full pl-2 pr-4 h-full"
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
                  initial={
                    !disableAnimations ? { height: 0, opacity: 0 } : undefined
                  }
                  animate={
                    !disableAnimations
                      ? {
                          height:
                            filteredSuggestions.length *
                            (size === "sm" ? 36 : size === "lg" ? 52 : 44),
                          opacity: 1,
                        }
                      : undefined
                  }
                  exit={
                    !disableAnimations ? { height: 0, opacity: 0 } : undefined
                  }
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
