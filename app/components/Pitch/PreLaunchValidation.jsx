import { Users, Globe, Rocket, TrendingUp, CheckCircle } from "lucide-react";

export function PreLaunchValidation({ stats }) {
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 rounded-2xl p-8 text-center">
          <Users className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <div className="text-4xl font-bold text-white mb-2">
            {stats.waitlistSignups.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Waitlist Signups</div>
          <div className="text-emerald-400 text-xs mt-2">
            +{stats.monthlySignupGrowth}/month organically
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-2xl p-8 text-center">
          <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <div className="text-4xl font-bold text-white mb-2">
            {stats.campusInterest}+
          </div>
          <div className="text-sm text-gray-400">Campuses Interested</div>
          <div className="text-purple-400 text-xs mt-2">
            Letters of intent from student unions
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-2 border-teal-500/50 rounded-2xl p-8 text-center">
          <Rocket className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <div className="text-4xl font-bold text-white mb-2">
            {stats.pilotProviders}
          </div>
          <div className="text-sm text-gray-400">Pilot Providers</div>
          <div className="text-teal-400 text-xs mt-2">
            Ready to list services at launch
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-8 text-center">
          <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <div className="text-4xl font-bold text-white mb-2">
            {stats.marketValidation}%
          </div>
          <div className="text-sm text-gray-400">Would Use Platform</div>
          <div className="text-yellow-400 text-xs mt-2">
            From 500+ student survey
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-emerald-400">
            Market Research Highlights
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">
                  500+ Student Survey
                </div>
                <div className="text-sm text-gray-400">
                  89% would use campus-specific service marketplace
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">
                  Average Spend Intent
                </div>
                <div className="text-sm text-gray-400">
                  ${stats.avgIntentValue}/year on peer services
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">
                  Pain Point Validation
                </div>
                <div className="text-sm text-gray-400">
                  73% struggle to find trusted campus services
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">Provider Interest</div>
                <div className="text-sm text-gray-400">
                  67% of skilled students want to monetize their skills
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-purple-400">
            Early Partnerships Secured
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">12 Student Unions</div>
                <div className="text-sm text-gray-400">
                  Committed to promote at launch
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">
                  8 Campus Ambassadors
                </div>
                <div className="text-sm text-gray-400">
                  Recruited across 5 universities
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">
                  3 University Entrepreneurship Centers
                </div>
                <div className="text-sm text-gray-400">
                  Offering mentorship and support
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-gray-200">
                  Payment Infrastructure
                </div>
                <div className="text-sm text-gray-400">
                  Stripe & Paystack integrations ready
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h3 className="text-3xl font-bold mb-6 text-center">
          Launch Readiness: 95%
        </h3>
        <div className="w-full bg-gray-800 rounded-full h-4 mb-8">
          <div
            className="bg-gradient-to-r from-emerald-500 to-purple-500 h-4 rounded-full"
            style={{ width: "95%" }}
          ></div>
        </div>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-emerald-400 font-semibold mb-2 text-lg">
              ✓ Product Built
            </div>
            <div className="text-sm text-gray-400">
              Fully functional MVP ready
            </div>
          </div>
          <div>
            <div className="text-emerald-400 font-semibold mb-2 text-lg">
              ✓ Payment Systems
            </div>
            <div className="text-sm text-gray-400">
              Stripe & Paystack integrated
            </div>
          </div>
          <div>
            <div className="text-emerald-400 font-semibold mb-2 text-lg">
              ✓ Early Users
            </div>
            <div className="text-sm text-gray-400">
              {stats.waitlistSignups.toLocaleString()} on waitlist
            </div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-2 text-lg">
              ⏳ Go-to-Market
            </div>
            <div className="text-sm text-gray-400">
              Awaiting funding for launch
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
