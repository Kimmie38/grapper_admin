import { CheckCircle } from "lucide-react";
import { CompetitorCard } from "./CompetitorCard";

export function CompetitiveAdvantageSection() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 rounded-3xl p-8">
        <h3 className="text-3xl font-bold mb-6 text-emerald-400">✓ Grapper</h3>
        <ul className="space-y-4">
          {[
            "Built specifically for students",
            "15% commission (vs 20-30%)",
            "Social features + marketplace",
            "Verified campus profiles",
            "Escrow payment protection",
            "Multi-currency support",
            "Audio/video portfolios",
            "Mobile-first experience",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <span className="text-gray-200">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h3 className="text-3xl font-bold mb-6 text-gray-400">✗ Competitors</h3>
        <div className="space-y-6">
          <CompetitorCard
            name="Fiverr / Upwork"
            weakness="Not student-focused, 20-30% fees, complex, corporate feel"
          />
          <CompetitorCard
            name="TaskRabbit"
            weakness="Limited to US/UK, only physical tasks, no student verification"
          />
          <CompetitorCard
            name="Campus Bulletin Boards"
            weakness="Offline, no payments, zero trust, limited reach"
          />
          <CompetitorCard
            name="WhatsApp/Facebook Groups"
            weakness="No structure, no payments, spam, no accountability"
          />
        </div>
      </div>
    </div>
  );
}
