export function ProblemCard({ icon, stat, title, description }) {
  return (
    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-8 hover:border-red-500/40 transition-all">
      <div className="text-red-400 mb-4">{icon}</div>
      <div className="text-5xl font-black text-red-400 mb-3">{stat}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
