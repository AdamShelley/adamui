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
};

const SearchBar = ({
  className,
  alwaysOpen = false,
  autoComplete = false,
  suggestions = [],
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = React.useState(alwaysOpen ?? false);
  const [query, setQuery] = React.useState("");

  const handleClick = () => {
    if (alwaysOpen) return;
    setIsOpen((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.value.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <motion.div
        layout={true}
        animate={{ scale: isOpen ? 1.1 : 1 }}
        transition={{
          layout: { duration: 0.2 },
          scale: { type: "spring", stiffness: 200, damping: 20 },
        }}
        className={cn(
          "w-fit border-4 border-teal-600 rounded-full inline-flex items-center bg-white overflow-hidden",
          className
        )}
      >
        <Search
          className={cn("h-5 w-5 font-bold m-3", {
            "text-gray-500": isOpen,
            "text-teal-600": !isOpen,
            "cursor-pointer": !alwaysOpen,
          })}
          onClick={handleClick}
        />

        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              <motion.input
                type="text"
                className="bg-white text-black p-3 text-sm min-w-0 pl-10"
                value={query}
                onChange={handleChange}
                exit={{ width: "10px", scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {autoComplete && query && (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md overflow-hidden"
          >
            <ul className="p-0 m-0">
              {filteredSuggestions.map((suggestion) => (
                <li key={suggestion.id} className="p-2 hover:bg-gray-100 text-black cursor-pointer">
                  {suggestion.value}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SearchBar;
