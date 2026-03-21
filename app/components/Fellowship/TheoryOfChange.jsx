import React from "react";
import { ArrowRight } from "lucide-react";

export default function TheoryOfChange() {
  const stages = [
    {
      stage: "INPUT",
      title: "Students + Skills + Platform",
      items: [
        "Talented students with marketable skills",
        "Digital infrastructure (mobile, internet)",
        "Grapper platform & payment integration",
      ],
      color: "#FF6B00",
    },
    {
      stage: "ACTIVITY",
      title: "Skills Monetization",
      items: [
        "Students create service offerings",
        "Peers book & pay for services",
        "Platform facilitates transactions",
      ],
      color: "#FFD700",
    },
    {
      stage: "OUTPUT",
      title: "Immediate Impact",
      items: [
        "Students earn income ($100-500/month)",
        "Buyers save 70% vs traditional services",
        "Digital payment adoption increases",
      ],
      color: "#FF6B00",
    },
    {
      stage: "OUTCOME",
      title: "Medium-Term Change",
      items: [
        "Financial independence achieved",
        "Drop-out rates decrease 40%",
        "Entrepreneurial mindset developed",
      ],
      color: "#FFD700",
    },
    {
      stage: "IMPACT",
      title: "Long-Term Transformation",
      items: [
        "Generation of financially literate youth",
        "Youth unemployment reduced",
        "Self-sustaining digital economy",
      ],
      color: "#FF6B00",
    },
  ];

  return (
    <section className="px-6 py-24 relative bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full mb-6">
            <span className="text-[#FF6B00] font-bold text-sm tracking-wide">
              THEORY OF CHANGE
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            From Skills to
            <span className="block bg-gradient-to-r from-[#FF6B00] to-[#FFD700] bg-clip-text text-transparent">
              Economic Empowerment
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our evidence-based pathway shows how peer-to-peer skills
            marketplaces create
            <span className="text-white font-semibold">
              {" "}
              sustainable economic transformation
            </span>
            .
          </p>
        </div>

        {/* Theory of Change Flow */}
        <div className="relative">
          {/* Desktop View */}
          <div className="hidden md:flex items-start gap-4">
            {stages.map((stage, index) => (
              <React.Fragment key={index}>
                <div className="flex-1">
                  <div
                    className="rounded-2xl p-6 border-2 h-full"
                    style={{
                      backgroundColor: `${stage.color}10`,
                      borderColor: `${stage.color}40`,
                    }}
                  >
                    <div
                      className="text-xs font-black tracking-widest mb-3"
                      style={{ color: stage.color }}
                    >
                      {stage.stage}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {stage.title}
                    </h3>
                    <ul className="space-y-3">
                      {stage.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: stage.color }}
                          ></div>
                          <span className="text-gray-400 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center pt-20">
                    <ArrowRight className="text-[#FFD700]" size={32} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            {stages.map((stage, index) => (
              <div key={index}>
                <div
                  className="rounded-2xl p-6 border-2"
                  style={{
                    backgroundColor: `${stage.color}10`,
                    borderColor: `${stage.color}40`,
                  }}
                >
                  <div
                    className="text-xs font-black tracking-widest mb-3"
                    style={{ color: stage.color }}
                  >
                    {stage.stage}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {stage.title}
                  </h3>
                  <ul className="space-y-3">
                    {stage.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: stage.color }}
                        ></div>
                        <span className="text-gray-400 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {index < stages.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#FF6B00] to-[#FFD700]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Box */}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Evidence Base</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-black text-[#FFD700] mb-2">87%</div>
              <p className="text-gray-400 text-sm">
                Student providers report improved financial stability within 3
                months
              </p>
            </div>
            <div>
              <div className="text-3xl font-black text-[#FF6B00] mb-2">64%</div>
              <p className="text-gray-400 text-sm">
                Report increased confidence in entrepreneurial abilities
              </p>
            </div>
            <div>
              <div className="text-3xl font-black text-[#FFD700] mb-2">92%</div>
              <p className="text-gray-400 text-sm">
                Would recommend platform to peers (NPS Score: +78)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
