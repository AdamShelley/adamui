import * as React from "react";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

type TimelineItem = {
  id: number;
  title: string;
  date: string;
  content: string;
  children?: {
    title: string;
    date: string;
    content: string;
  }[];
};

interface TimelineContextValue {
  variant: "modern" | "minimal" | "condensed";
  orientation: "vertical" | "horizontal";
  size: "sm" | "md" | "lg";
}

const TimelineContext = React.createContext<TimelineContextValue | undefined>(
  undefined
);

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TimelineContextValue["variant"];
  orientation?: TimelineContextValue["orientation"];
  size?: TimelineContextValue["size"];
  children: React.ReactNode;
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      variant = "modern",
      orientation = "vertical",
      size = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TimelineContext.Provider value={{ variant, orientation, size }}>
        <div
          ref={ref}
          className={cn(
            "relative",
            orientation === "vertical" ? "space-y-8" : "flex space-x-8",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TimelineContext.Provider>
    );
  }
);
Timeline.displayName = "Timeline";

interface TimelineDotProps extends HTMLMotionProps<"div"> {
  status?: "primary" | "secondary" | "muted";
}

interface TimelineItemProps extends HTMLMotionProps<"div"> {
  item: TimelineItem;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ item, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("relative pl-10 pb-8", className)} // Increased padding-left for timeline
        {...props}
      >
        {/* Timeline dot with hover effect */}
        <TimelineDot
          className={cn(
            "ring-2 ring-background",
            hasChildren && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => hasChildren && setIsOpen(!isOpen)}
        />

        {/* More prominent connector line */}
        <TimelineConnector />

        <div className="space-y-1.5 pt-1">
          <div
            className={cn(
              "inline-flex  items-center gap-2 -mt-6", // Aligned with the dot
              hasChildren && "cursor-pointer"
            )}
            onClick={() => hasChildren && setIsOpen(!isOpen)}
          >
            <h3 className="font-semibold leading-none text-primary">
              {item.title}
            </h3>
            <span className="text-sm text-muted-foreground">{item.date}</span>
            {hasChildren && (
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="ml-auto"
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{item.content}</p>

          {hasChildren && (
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.3 },
                      opacity: { duration: 0.2, delay: 0.1 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3 },
                      opacity: { duration: 0.2 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  {/* Children timeline items */}
                  <div className="mt-4 space-y-4 relative">
                    {/* Vertical line for children */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

                    {item.children?.map((child, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-6 space-y-1.5"
                      >
                        {/* Horizontal connector for child items */}
                        <div className="absolute left-0 top-3 w-4 h-px bg-border" />

                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium leading-none">
                            {child.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {child.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {child.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

// Updated TimelineDot with more prominent styling
export const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, status = "primary", ...props }, ref) => {
    const context = React.useContext(TimelineContext);

    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          "absolute left-0 rounded-full z-10",
          {
            "bg-primary": status === "primary",
            "bg-secondary": status === "secondary",
            "bg-muted": status === "muted",
            "h-4 w-4": context?.size === "sm",
            "h-5 w-5": context?.size === "md",
            "h-6 w-6": context?.size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

// Updated TimelineConnector with more prominent styling
export const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      className={cn(
        "absolute left-2.5 top-6 -bottom-8 w-px bg-border",
        className
      )}
      {...props}
    />
  );
});

export type { TimelineProps, TimelineItemProps, TimelineDotProps };
