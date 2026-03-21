import { Target } from "lucide-react";

export function Milestone({ text }) {
  return (
    <li className="flex items-start gap-3">
      <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
      <span className="text-gray-300">{text}</span>
    </li>
  );
}
