import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GitBranch } from "lucide-react";

const NODE_COLORS = {
  ego: "#0A0A0B",
  hazard: "#DC2626",
  vehicle: "#0284C7",
  default: "#6B7280",
};

export default function SceneGraph({ data, title = "Road Scene Understanding" }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data?.nodes?.length) {
      svg
        .append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .attr("fill", "#9CA3AF")
        .attr("font-size", 12)
        .attr("font-family", "Forum, serif")
        .text("Scanning road scene…");
      return;
    }

    const container = svgRef.current.parentElement;
    const W = container?.clientWidth || 320;
    const H = 220;

    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const nodes = data.nodes.map((n) => ({ ...n }));
    const links = (data.edges || []).map((e) => ({ ...e }));

    simRef.current?.stop();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(70)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide().radius(28));

    simRef.current = simulation;

    const g = svg.append("g");

    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#D1D5DB")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => (d.relation === "approaching" ? "4,2" : "none"));

    const linkLabel = g
      .append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d) => d.relation || "")
      .attr("font-size", 8)
      .attr("fill", "#9CA3AF")
      .attr("text-anchor", "middle")
      .attr("font-family", "Forum, serif");

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append("circle")
      .attr("r", (d) => (d.type === "ego" ? 14 : 10))
      .attr("fill", (d) => NODE_COLORS[d.type] || NODE_COLORS.default)
      .attr("stroke", (d) => (d.type === "ego" ? "#fff" : "none"))
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);

    node
      .append("text")
      .text((d) => d.label)
      .attr("font-size", 9)
      .attr("fill", "#374151")
      .attr("dx", 16)
      .attr("dy", 4)
      .attr("font-family", "Forum, serif")
      .attr("font-weight", (d) => (d.type === "ego" ? 700 : 400));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      linkLabel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2 - 4);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [data]);

  return (
    <div className="glass-card-dark p-5">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-4 h-4 text-sentinel-blue" />
        <p className="text-xs font-semibold text-sentinel-gray uppercase tracking-widest">
          {title}
        </p>
      </div>
      <svg ref={svgRef} width="100%" height={220} className="overflow-visible" />
      <div className="flex gap-3 mt-2 text-[10px] text-sentinel-gray">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sentinel-ink" /> You
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sentinel-red" /> Hazard
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sentinel-blue" /> Vehicle
        </span>
      </div>
    </div>
  );
}
