import React from "react";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type SearchBarProps = {
  className?: string;
  alwaysOpen?: boolean;
};

const SearchBar = ({ className, alwaysOpen }: SearchBarProps) => {
  const [isOpen, setIsOpen] = React.useState(alwaysOpen ?? false);

  const handleClick = () => {
    if (alwaysOpen) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <motion.div
      layout={true}
      animate={{ scale: isOpen ? 1.1 : 1 }}
      transition={{
        layout: { duration: 0.2 },
        scale: { type: "spring", stiffness: 500, damping: 20 },
      }}
      className={cn(
        "w-fit border-4 border-teal-600 rounded-full  inline-flex items-center bg-white overflow-hidden",
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
          <motion.input
            type="text"
            className="bg-white text-black p-3 text-sm min-w-0 pl-10"
            initial={{ width: 0, scale: 0 }}
            animate={{ width: "200px", scale: 1 }}
            exit={{ width: 0, scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
