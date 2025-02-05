import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface TimelineProps {
  items: {
    id: string;
    title: string;
    date: string;
    content: string;
    children?: {
      title: string;
      date: string;
      content: string;
    }[];
  }[];
}

interface TimelineItemProps {
  data: {
    id: string;
    title: string;
    date: string;
    content: string;
    children?: {
      title: string;
      date: string;
      content: string;
    }[];
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export const TimelineItem = ({
  data,
  isExpanded,
  onToggle,
}: TimelineItemProps) => {
  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-200" />

      {/* Timeline node */}
      <div className="relative flex items-start gap-4 group">
        {/* Icon/Dot container */}
        <div
          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                     transition-colors duration-300 cursor-pointer
                     ${
                       isExpanded
                         ? "bg-violet-100 text-violet-600"
                         : "bg-white text-gray-400 border-2 border-gray-200"
                     }
                     hover:border-violet-400`}
          onClick={onToggle}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-3 h-3 rounded-full bg-current" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pt-1 pb-8">
          <div
            className={`text-lg font-semibold group-hover:text-violet-600
                       transition-colors duration-200 cursor-pointer`}
            onClick={onToggle}
          >
            {data.title}
          </div>
          <div className="text-sm mt-1">{data.date}</div>

          <div className="mt-2 ">{data.content}</div>

          {/* Expanded content with children */}
          <div
            className={`mt-6 space-y-4 transition-all duration-300 ease-in-out
                       ${
                         isExpanded
                           ? "opacity-100 max-h-[500px]"
                           : "opacity-0 max-h-0 overflow-hidden"
                       }`}
          >
            {data.children?.map((child, index) => (
              <div
                key={index}
                className="relative ml-4 pl-6 border-l border-gray-200"
              >
                <div
                  className="absolute left-0 top-3 w-3 h-3 -translate-x-1.5
                              rounded-full border-2 border-gray-300 bg-white"
                />
                <div>
                  <div className="font-medium text-primary">{child.title}</div>
                  <div className="text-sm text-white mt-1">{child.date}</div>
                  <div className="mt-2 text-white">{child.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Timeline = ({ items }: TimelineProps) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (itemId: any) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          data={item}
          isExpanded={expandedItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
};
