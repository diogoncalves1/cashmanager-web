export default function LineChartLoading({
  height,
  className,
}: {
  height: number;
  className?: string;
}) {
  return (
    <div className={`max-w-full ${className} pb-4 overflow-x-auto custom-scrollbar`}>
      <div className="min-w-full xl:min-w-full">
        <div className="animate-pulse flex flex-col justify-between">
          <div style={{ height: `${height}px` }} className="bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
