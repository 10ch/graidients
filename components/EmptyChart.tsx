export function EmptyChart() {
  return (
    <div className="chart-container h-[500px]">
      <div className="h-full flex flex-col">
        {/* Y-axis labels */}
        <div className="flex-1 flex">
          <div className="w-12 flex flex-col justify-between text-right pr-2">
            <span className="chart-axis">100</span>
            <span className="chart-axis">90</span>
            <span className="chart-axis">80</span>
            <span className="chart-axis">70</span>
            <span className="chart-axis">60</span>
            <span className="chart-axis">50</span>
            <span className="chart-axis">40</span>
            <span className="chart-axis">30</span>
            <span className="chart-axis">20</span>
            <span className="chart-axis">10</span>
            <span className="chart-axis">0</span>
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
              <div className="w-[15%]">
                <div className="chart-axis">Totally</div>
                <div className="chart-axis">Fine</div>
              </div>
              <div className="w-[15%]">
                <div className="chart-axis">Mostly</div>
                <div className="chart-axis">Okay</div>
              </div>
              <div className="w-[15%]">
                <div className="chart-axis">Not</div>
                <div className="chart-axis">Sure</div>
              </div>
              <div className="w-[15%]">
                <div className="chart-axis">Feels</div>
                <div className="chart-axis">Sketchy</div>
              </div>
              <div className="w-[15%]">
                <div className="chart-axis">Crosses</div>
                <div className="chart-axis">Line</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}