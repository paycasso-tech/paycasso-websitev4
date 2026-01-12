"use client";

import { motion } from "framer-motion";

export default function FlowPair({ data }: { data: any }) {
  /**
   * SVG padding to prevent clipping of arrows / curves
   */
  const svgPaddingY = data.svg.paddingY ?? 60;

  return (
    <motion.div
      className="absolute"
      style={{
        top: data.containerTop,
        left: data.containerLeft,
      }}
      variants={{
        initial: {
          y: 80,
          opacity: 0,
        },
        enter: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        },
      }}
    >
      {/* ================= HUB ================= */}
      <div
        className="absolute z-20"
        style={{ left: data.hub.left, top: data.hub.top }}
      >
        <div className="w-9 h-9 rounded-md border border-white/40 bg-black/60 flex items-center justify-center">
          {/* inline hub SVG goes here */}
        </div>
      </div>

      {/* ================= SVG ================= */}
      <svg
        width={data.svg.width}
        height={data.svg.height + svgPaddingY * 2}
        viewBox={`0 0 ${data.svg.width} ${data.svg.height + svgPaddingY * 2}`}
        fill="none"
        overflow="visible"
      >
        {/* ================= FILTERS ================= */}
        <defs>
          {/* Glow for hub dots */}
          <filter id="glowDot" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow for arrows */}
          <filter id="glowArrow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* ================= MARKERS ================= */}
          {data.svg.paths.map((p: any, i: number) => (
            <g key={i}>
              {/* HUB DOT MARKER */}
              {p.startMarker?.type === "dot" && (
                <marker
                  id={`dot-${data.id}-${i}`}
                  markerWidth={p.startMarker.size}
                  markerHeight={p.startMarker.size}
                  refX={p.startMarker.size / 2}
                  refY={p.startMarker.size / 2}
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <circle
                    cx={p.startMarker.size / 2}
                    cy={p.startMarker.size / 2}
                    r={p.startMarker.size / 2}
                    fill="white"
                    filter="url(#glowDot)"
                  />
                </marker>
              )}

              {/* TEXT ARROW MARKER */}
              {p.endMarker?.type === "arrow" && (
                <marker
                  id={`arrow-${data.id}-${i}`}
                  markerWidth={p.endMarker.width}
                  markerHeight={p.endMarker.height}
                  refX={p.endMarker.width}
                  refY={p.endMarker.height / 2}
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                  overflow="visible"
                >
                  <path
                    d={`M0 0 L${p.endMarker.width} ${
                      p.endMarker.height / 2
                    } L0 ${p.endMarker.height} Z`}
                    fill="white"
                    filter="url(#glowArrow)"
                  />
                </marker>
              )}
            </g>
          ))}
        </defs>

        {/* ================= PATHS ================= */}
        <g transform={`translate(0, ${svgPaddingY})`}>
          {data.svg.paths.map((p: any, i: number) => (
            <path
              key={i}
              d={`${p.d} h 0.01`} // force horizontal tangent
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              fill="none"
              markerStart={
                p.startMarker ? `url(#dot-${data.id}-${i})` : undefined
              }
              markerEnd={
                p.endMarker ? `url(#arrow-${data.id}-${i})` : undefined
              }
            />
          ))}
        </g>
      </svg>

      {/* ================= TEXT (POPS AFTER PAUSE) ================= */}
      {data.texts.map((t: any, i: number) => (
        <motion.div
          key={i}
          className="absolute text-white"
          style={{
            top: t.top,
            left: data.textColumn.left,
            width: data.textColumn.width,
          }}
          variants={{
            initial: {
              opacity: 0,
              scale: 0.95,
            },
            enter: {
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.25, // 👈 pause AFTER flow settles
                duration: 0.35,
                ease: "easeOut",
              },
            },
          }}
        >
          <p className="text-sm font-medium leading-[1.3]">{t.title}</p>
          <p className="text-xs text-white/60 leading-normal mt-1">
            {t.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
