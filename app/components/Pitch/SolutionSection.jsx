import { Sparkles, Shield, Zap } from "lucide-react";
import { SolutionCard } from "./SolutionCard";

export function SolutionSection() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <SolutionCard
        icon={<Sparkles className="w-10 h-10 text-emerald-400" />}
        title="Social Marketplace"
        features={[
          "Instagram-style feed with services",
          "Audio/video portfolio showcases",
          "Verified student profiles",
          "Skill-based matchmaking",
        ]}
      />
      <SolutionCard
        icon={<Shield className="w-10 h-10 text-purple-400" />}
        title="Secure Transactions"
        features={[
          "Escrow payment protection",
          "Milestone-based releases",
          "Multi-currency support",
          "15% platform commission",
        ]}
      />
      <SolutionCard
        icon={<Zap className="w-10 h-10 text-teal-400" />}
        title="Smart Features"
        features={[
          "AI-powered recommendations",
          "In-app messaging",
          "Review & rating system",
          "Dispute resolution",
        ]}
      />
    </div>
  );
}
