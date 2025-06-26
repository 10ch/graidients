export function EmptyChart() {
  return (
    <div className="chart-container h-[500px]">
      <div className="h-full flex flex-col">
        {/* Y-axis labels */}
        <div className="flex-1 flex">
          <div className="w-12 flex flex-col justify-between text-right pr-2">
            <span className="text-sm text-gray-700 font-medium">100</span>
            <span className="text-sm text-gray-700 font-medium">90</span>
            <span className="text-sm text-gray-700 font-medium">80</span>
            <span className="text-sm text-gray-700 font-medium">70</span>
            <span className="text-sm text-gray-700 font-medium">60</span>
            <span className="text-sm text-gray-700 font-medium">50</span>
            <span className="text-sm text-gray-700 font-medium">40</span>
            <span className="text-sm text-gray-700 font-medium">30</span>
            <span className="text-sm text-gray-700 font-medium">20</span>
            <span className="text-sm text-gray-700 font-medium">10</span>
            <span className="text-sm text-gray-700 font-medium">0</span>
          </div>

          {/* Chart area with grid lines */}
          <div className="flex-1 relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="border-t border-gray-200"></div>
              ))}
            </div>

            {/* Bars container */}
            <div className="absolute inset-0 flex items-end px-8">
              <div className="w-full flex justify-between items-end">
                <div className="w-[15%] bg-gray-300 rounded-t" style={{ height: "0%" }}></div>
                <div className="w-[15%] bg-gray-300 rounded-t" style={{ height: "0%" }}></div>
                <div className="w-[15%] bg-gray-300 rounded-t" style={{ height: "0%" }}></div>
                <div className="w-[15%] bg-gray-300 rounded-t" style={{ height: "0%" }}></div>
                <div className="w-[15%] bg-gray-300 rounded-t" style={{ height: "0%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex mt-2">
          <div className="w-12"></div>
          <div className="flex-1 px-8">
            <div className="flex justify-between text-center">
              <div className="w-[15%] text-sm text-gray-900 font-bold">
                <div>Totally</div>
                <div>Fine</div>
              </div>
              <div className="w-[15%] text-sm text-gray-900 font-bold">
                <div>Mostly</div>
                <div>Okay</div>
              </div>
              <div className="w-[15%] text-sm text-gray-900 font-bold">
                <div>Not</div>
                <div>Sure</div>
              </div>
              <div className="w-[15%] text-sm text-gray-900 font-bold">
                <div>Feels</div>
                <div>Sketchy</div>
              </div>
              <div className="w-[15%] text-sm text-gray-900 font-bold">
                <div>Crosses</div>
                <div>Line</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
