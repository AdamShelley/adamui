import React from "react";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Define the type for the autocomplete suggestions
interface Suggestion {
  id: string | number;
  value: string;
}

type SearchBarProps = {
  className?: string;
  alwaysOpen?: boolean;
  autoComplete?: boolean;
  suggestions?: Suggestion[];
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;
};

const SearchBar = ({
  className,
  alwaysOpen = false,
  autoComplete = false,
  suggestions = [],
  onSelect,
  onChange,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = React.useState(alwaysOpen ?? false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isTyping, setIsTyping] = React.useState(false);
  const selectedRef = React.useRef<HTMLLIElement>(null);
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
    setQuery(value);
    setSelectedIndex(-1);
    onSelect?.(value);
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

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.value.toLowerCase().includes(query.toLowerCase())
  );

  const showSuggestions = autoComplete && isOpen && query && filteredSuggestions.length > 0;

  const scale = isTyping ? 0.99 : (isOpen ? 1.01 : 1);

  return (
    <div className="relative w-full" style={{ minHeight: "48px" }}>
      <div className="w-fit">
        <motion.div
          layoutId={`searchbar-${uniqueId}`}
          animate={{ scale }}
          style={{
            transformOrigin: "left center",
            willChange: "transform"
          }}
          transition={{
            scale: { type: "spring", stiffness: 700, damping: 50 }
          }}
        >
          <div className={cn(
            "relative border-4 border-teal-600 bg-white",
            "transition-[border-radius] duration-300 ease-out",
            showSuggestions 
              ? "rounded-t-[24px]" 
              : "rounded-[24px]"
          )}>
            <div className={cn(
              "flex items-center transition-[padding] duration-300",
              isOpen ? "pr-4" : "pr-0"
            )}>
              <motion.div
                animate={{ 
                  scale: isOpen ? 0.9 : 1,
                  rotate: isOpen ? 360 : 0
                }}
                transition={{
                  scale: { type: "spring", stiffness: 600, damping: 45 },
                  rotate: { type: "spring", stiffness: 200, damping: 20 }
                }}
                className="flex items-center"
              >
                <Search
                  className={cn("h-5 w-5 font-bold m-3 transition-colors duration-300", {
                    "text-gray-500": isOpen,
                    "text-teal-600": !isOpen,
                    "cursor-pointer": !alwaysOpen,
                  })}
                  onClick={handleClick}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: 200,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }
                    }}
                    exit={{ 
                      width: 0,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        transition: {
                          duration: 0.15,
                          delay: 0.1
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        transition: {
                          duration: 0.1
                        }
                      }}
                    >
                      <input
                        type="text"
                        className="bg-white text-black py-3 text-sm outline-none focus:outline-none focus:ring-0 w-full pl-2"
                        value={query}
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
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0
                  }}
                  transition={{ 
                    height: { type: "spring", stiffness: 700, damping: 50 }
                  }}
                  className="w-full overflow-hidden"
                >
                  <ul className="p-0 m-0 max-h-[200px] overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <li 
                        ref={index === selectedIndex ? selectedRef : null}
                        key={suggestion.id} 
                        className={cn(
                          "p-3 hover:bg-gray-100 text-black cursor-pointer transition-colors text-sm",
                          { "bg-gray-100": index === selectedIndex }
                        )}
                        onClick={() => handleSelect(suggestion.value)}
                      >
                        {suggestion.value}
                      </li>
                    ))}
                  </ul>
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
