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
  const selectedRef = React.useRef<HTMLLIElement>(null);
  const uniqueId = React.useId(); // Generate a unique ID for each instance

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

  return (
    <div className="relative w-full">
      <motion.div
        layout={true}
        layoutId={`searchbar-${uniqueId}`} // Make layoutId unique for each instance
        animate={{ 
          scale: isOpen ? 1.05 : 1
        }}
        transition={{
          layout: { type: "spring", stiffness: 400, damping: 30 },
          scale: { type: "spring", stiffness: 400, damping: 25 }
        }}
        className={cn(
          "w-full max-w-fit border-4 border-teal-600 inline-flex items-center bg-white overflow-hidden",
          "transition-all duration-300 ease-out",
          showSuggestions 
            ? "rounded-t-[24px]" 
            : "rounded-[24px]",
          className
        )}
      >
        <motion.div
          animate={{ 
            scale: isOpen ? 0.9 : 1,
            rotate: isOpen ? 360 : 0
          }}
          transition={{
            scale: { type: "spring", stiffness: 500, damping: 30 },
            rotate: { type: "spring", stiffness: 200, damping: 20 }
          }}
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
            <motion.input
              type="text"
              className="bg-white text-black p-3 text-sm min-w-[200px] pl-2 outline-none focus:outline-none focus:ring-0"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ 
                width: "auto",
                opacity: 1,
                x: 0,
                transition: {
                  width: { type: "spring", stiffness: 300, damping: 30 },
                  x: { type: "spring", stiffness: 400, damping: 30 },
                  opacity: { duration: 0.2 }
                }
              }}
              exit={{ 
                width: 0,
                opacity: 0,
                x: -10,
                transition: {
                  width: { duration: 0.2, ease: "easeInOut" },
                  x: { duration: 0.2, ease: "easeInOut" },
                  opacity: { duration: 0.15 }
                }
              }}
              style={{ WebkitAppearance: "none" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 1 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              scale: 1.05
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              scale: 1,
              transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.15 },
                scale: { duration: 0.15 }
              }
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut",
              scale: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className={cn(
              "absolute left-0 bg-white border-4 border-t-0 border-teal-600",
              "rounded-b-[24px] overflow-hidden shadow-lg z-10",
              "transition-all duration-300 ease-out"
            )}
            style={{ 
              width: "100%",
              maxWidth: "fit-content",
              minWidth: "100%",
              marginTop: "-2px",
              transformOrigin: "top"
            }}
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
  );
};

export default SearchBar;
