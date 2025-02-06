import { MotionProps } from "motion/react";

export interface TimelineItem {
  id: string | number;
  title: string;
  date: string;
  content: string;
  status?: "completed" | "current" | "upcoming";
}

export interface TimelineProps extends MotionProps {
  items: TimelineItem[];
  variant?: "modern" | "classic" | "minimal";
}
