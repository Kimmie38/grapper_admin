export function VisionCard({ icon, title, description }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all">
      <div className="text-emerald-400 mb-4 flex justify-center">{icon}</div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
