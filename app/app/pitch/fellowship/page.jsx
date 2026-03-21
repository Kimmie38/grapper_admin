import React from "react";
import FellowshipHero from "@/components/Fellowship/FellowshipHero";
import ImpactProblem from "@/components/Fellowship/ImpactProblem";
import OurSolution from "@/components/Fellowship/OurSolution";
import TheoryOfChange from "@/components/Fellowship/TheoryOfChange";
import ImpactMetrics from "@/components/Fellowship/ImpactMetrics";
import FinancialInclusionModel from "@/components/Fellowship/FinancialInclusionModel";
import MarketContext from "@/components/Fellowship/MarketContext";
import MastercardAlignment from "@/components/Fellowship/MastercardAlignment";
import GrantUtilization from "@/components/Fellowship/GrantUtilization";
import ExpectedOutcomes from "@/components/Fellowship/ExpectedOutcomes";
import Traction from "@/components/Fellowship/Traction";
import TeamSection from "@/components/Fellowship/TeamSection";
import CallToAction from "@/components/Fellowship/CallToAction";

export default function FellowshipPitchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A1A2E] to-[#16213E]">
      <FellowshipHero />
      <ImpactProblem />
      <OurSolution />
      <TheoryOfChange />
      <ImpactMetrics />
      <FinancialInclusionModel />
      <MarketContext />
      <Traction />
      <MastercardAlignment />
      <GrantUtilization />
      <ExpectedOutcomes />
      <TeamSection />
      <CallToAction />
    </div>
  );
}
