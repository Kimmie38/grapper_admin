import { Users, DollarSign } from "lucide-react";
import { ProblemCard } from "./ProblemCard";

export function ProblemSection() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <ProblemCard
          icon={<Users className="w-12 h-12" />}
          stat="150M+"
          title="Disconnected Students"
          description="University students globally struggle to find skilled peers for academic projects, creative work, and everyday services."
        />
        <ProblemCard
          icon={<DollarSign className="w-12 h-12" />}
          stat="$2.3T"
          title="Untapped Earning Potential"
          description="Talented students can't easily monetize their skills within their campus community, leaving billions in potential income unrealized."
        />
      </div>

      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Current Solutions Fall Short
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-red-400 font-bold text-xl mb-2">
              Generic Freelance Platforms
            </div>
            <p className="text-gray-400 text-sm">
              Not built for student needs, complex onboarding, high fees
              (20-30%)
            </p>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-bold text-xl mb-2">
              Campus Bulletin Boards
            </div>
            <p className="text-gray-400 text-sm">
              Offline, limited reach, no payment security, zero accountability
            </p>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-xl mb-2">
              Social Media Groups
            </div>
            <p className="text-gray-400 text-sm">
              Unstructured, no trust systems, payment friction, spam-filled
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
