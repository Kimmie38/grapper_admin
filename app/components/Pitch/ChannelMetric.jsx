export function ChannelMetric({ channel, percentage }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-purple-400 mb-2">
        {percentage}
      </div>
      <div className="text-sm text-gray-400">{channel}</div>
    </div>
  );
}
