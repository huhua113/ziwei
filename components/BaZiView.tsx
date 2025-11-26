import React, { useMemo, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BaZi, FiveElement } from '../types';

interface BaZiViewProps {
  bazi: BaZi;
}

export const BaZiView: React.FC<BaZiViewProps> = ({ bazi }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
     return Object.entries(bazi.fiveElements).map(([name, value]) => ({ name, value }));
  }, [bazi]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const colorMap: Record<string, string> = {
        [FiveElement.WOOD]: '#4ade80', // Green
        [FiveElement.FIRE]: '#f87171', // Red
        [FiveElement.EARTH]: '#fbbf24', // Amber
        [FiveElement.METAL]: '#94a3b8', // Slate
        [FiveElement.WATER]: '#60a5fa', // Blue
    };

    const pie = d3.pie<{name: string, value: number}>().value(d => d.value).sort(null);
    const arc = d3.arc<d3.PieArcDatum<{name: string, value: number}>>().innerRadius(40).outerRadius(radius - 10);

    const arcs = g.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => colorMap[d.data.name] || '#ccc')
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .text(d => d.data.value > 0 ? `${d.data.name}${d.data.value}` : '');

  }, [data]);

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-rose-100">
        <h3 className="text-lg font-bold text-primary mb-4">八字五行分布</h3>
        
        <div className="flex gap-4 mb-4">
            <div className="text-center">
                <div className="text-xs text-slate-500">年柱</div>
                <div className="text-lg font-bold font-mono text-slate-700">{bazi.year}</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-500">月柱</div>
                <div className="text-lg font-bold font-mono text-slate-700">{bazi.month}</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-500">日柱</div>
                <div className="text-lg font-bold font-mono text-slate-700">{bazi.day}</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-500">时柱</div>
                <div className="text-lg font-bold font-mono text-slate-700">{bazi.hour}</div>
            </div>
        </div>

        <svg ref={svgRef} width={300} height={200} className="overflow-visible" />
        
        <div className="mt-4 text-xs text-slate-500 text-center max-w-xs">
           此图显示五行强弱。五行平衡为贵，过强或过弱需注意相应脏腑健康及运势起伏。
        </div>
    </div>
  );
};
