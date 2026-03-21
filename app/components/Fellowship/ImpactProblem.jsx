import React from "react";
import {
  AlertTriangle,
  DollarSign,
  BookOpen,
  TrendingDown,
} from "lucide-react";

export default function ImpactProblem() {
  const problems = [
    {
      icon: TrendingDown,
      stat: "67%",
      title: "Youth Unemployment Crisis",
      description:
        "Two-thirds of African youth are unemployed or underemployed, despite having valuable skills and education.",
      color: "#FF6B00",
    },
    {
      icon: DollarSign,
      stat: "$0",
      title: "Zero Income While Learning",
      description:
        "Students struggle financially through university, unable to monetize their skills or support themselves.",
      color: "#FFD700",
    },
    {
      icon: BookOpen,
      stat: "85%",
      title: "Unaffordable Academic Support",
      description:
        "Students can't afford tutoring, mentorship, or skill development services from traditional providers.",
      color: "#FF6B00",
    },
    {
      icon: AlertTriangle,
      stat: "45%",
      title: "Drop Out Due to Finances",
      description:
        "Nearly half of students drop out of university because they can't afford tuition and living expenses.",
      color: "#FFD700",
    },
  ];

  return (
    <section className="px-6 py-24 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-6">
            <span className="text-red-400 font-bold text-sm tracking-wide">
              THE CRISIS WE'RE SOLVING
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Africa's Youth Are
            <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Trapped in Poverty
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Despite having skills, education, and ambition, millions of African
            students face a brutal reality:
            <span className="text-white font-semibold">
              {" "}
              no income, no opportunities, no escape
            </span>
            .
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 hover:border-[#FF6B00]/50 transition-all hover:scale-105"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${problem.color}20`,
                      borderColor: `${problem.color}40`,
                      borderWidth: 2,
                    }}
                  >
                    <problem.icon size={32} style={{ color: problem.color }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className="text-6xl font-black mb-3"
                    style={{ color: problem.color }}
                  >
                    {problem.stat}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Quote */}
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-l-4 border-[#FF6B00] rounded-2xl p-10">
          <p className="text-2xl text-gray-300 italic leading-relaxed">
            "We're creating a generation of educated poor people—students with
            degrees but no money, skills but no opportunities, dreams but no
            pathway to achieve them.
            <span className="text-white font-bold not-italic">
              {" "}
              This is the problem Grapper was built to solve
            </span>
            ."
          </p>
        </div>
      </div>
    </section>
  );
}
