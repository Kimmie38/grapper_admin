import { CheckCircle } from "lucide-react";

export function SolutionCard({ icon, title, features }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
