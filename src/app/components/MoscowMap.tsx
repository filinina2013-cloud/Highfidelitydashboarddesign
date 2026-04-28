import { useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Navigation2, Layers } from 'lucide-react';
import { Vehicle } from '../data/vehicles';

interface MoscowMapProps {
  vehicles: Vehicle[];
  onSelectVehicle?: (v: Vehicle) => void;
  selectedId?: string;
}

const statusColor = (status: Vehicle['status']) => {
  if (status === 'active') return '#22C55E';
  if (status === 'charging') return '#FFDD2D';
  return '#EF4444';
};

const mapBtnStyle: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: 'rgba(11, 15, 30, 0.9)',
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#9CA3AF',
};

export function MoscowMap({ vehicles, onSelectVehicle, selectedId }: MoscowMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const chargingCount = vehicles.filter((v) => v.status === 'charging').length;
  const errorCount = vehicles.filter((v) => v.status === 'error').length;

  return (
    <div
      style={{
        flex: '0 0 70%',
        background: '#0B0F1E',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* MAP SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 480"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-red" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-yellow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="center-glow" cx="50%" cy="52%" r="42%">
            <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0B0F1E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="900" height="480" fill="#0B0F1E" />

        {/* Street grid — minor streets */}
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 37}
            x2="900"
            y2={i * 37}
            stroke="#121828"
            strokeWidth="0.6"
          />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 39}
            y1="0"
            x2={i * 39}
            y2="480"
            stroke="#121828"
            strokeWidth="0.6"
          />
        ))}

        {/* Center atmospheric glow */}
        <rect
          width="900"
          height="480"
          fill="url(#center-glow)"
        />

        {/* Parks / green zones */}
        <rect x="308" y="322" width="98" height="70" rx="5" fill="#0D1F14" opacity="0.85" />
        <rect x="652" y="148" width="112" height="92" rx="5" fill="#0D1F14" opacity="0.8" />
        <rect x="150" y="264" width="80" height="58" rx="4" fill="#0D1F14" opacity="0.75" />
        <rect x="505" y="120" width="65" height="50" rx="4" fill="#0D1F14" opacity="0.75" />
        <rect x="418" y="408" width="76" height="58" rx="4" fill="#0D1F14" opacity="0.7" />
        {/* Park labels */}
        <text x="357" y="358" textAnchor="middle" fill="#1A3020" fontSize="7" fontFamily="Inter,sans-serif">Горький</text>
        <text x="708" y="194" textAnchor="middle" fill="#1A3020" fontSize="7" fontFamily="Inter,sans-serif">Измайлово</text>

        {/* City block fills (center density) */}
        <rect x="358" y="218" width="40" height="28" rx="2" fill="#141C2E" opacity="0.65" />
        <rect x="406" y="218" width="32" height="28" rx="2" fill="#141C2E" opacity="0.65" />
        <rect x="472" y="222" width="44" height="26" rx="2" fill="#141C2E" opacity="0.6" />
        <rect x="355" y="272" width="36" height="25" rx="2" fill="#141C2E" opacity="0.6" />
        <rect x="472" y="270" width="42" height="26" rx="2" fill="#141C2E" opacity="0.6" />
        <rect x="298" y="245" width="50" height="32" rx="2" fill="#141C2E" opacity="0.5" />
        <rect x="514" y="244" width="48" height="28" rx="2" fill="#141C2E" opacity="0.5" />
        <rect x="402" y="168" width="36" height="24" rx="2" fill="#141C2E" opacity="0.45" />
        <rect x="556" y="192" width="40" height="28" rx="2" fill="#141C2E" opacity="0.45" />
        <rect x="336" y="320" width="32" height="22" rx="2" fill="#141C2E" opacity="0.4" />

        {/* ===== MAJOR RADIAL STREETS from center (450, 252) ===== */}
        {/* N — Тверская / Ленинградское */}
        <line x1="450" y1="252" x2="424" y2="0" stroke="#1D2D45" strokeWidth="3.5" />
        <line x1="450" y1="252" x2="454" y2="0" stroke="#1D2D45" strokeWidth="2" />
        {/* NE — Ярославское / Пр. Мира */}
        <line x1="450" y1="252" x2="758" y2="40" stroke="#1D2D45" strokeWidth="2.8" />
        {/* E — Энтузиастов */}
        <line x1="450" y1="252" x2="900" y2="248" stroke="#1D2D45" strokeWidth="2.8" />
        {/* SE — Волгоградский */}
        <line x1="450" y1="252" x2="750" y2="468" stroke="#1D2D45" strokeWidth="2.5" />
        {/* S — Варшавское / Каширское */}
        <line x1="450" y1="252" x2="435" y2="480" stroke="#1D2D45" strokeWidth="3.5" />
        <line x1="450" y1="252" x2="462" y2="480" stroke="#1D2D45" strokeWidth="2" />
        {/* SW — Ленинский */}
        <line x1="450" y1="252" x2="175" y2="472" stroke="#1D2D45" strokeWidth="2.8" />
        {/* W — Кутузовский */}
        <line x1="450" y1="252" x2="0" y2="282" stroke="#1D2D45" strokeWidth="3.5" />
        {/* NW — Рублёвское */}
        <line x1="450" y1="252" x2="165" y2="42" stroke="#1D2D45" strokeWidth="2.5" />

        {/* Cross streets (inner ring area) */}
        <line x1="362" y1="200" x2="540" y2="200" stroke="#192538" strokeWidth="1.5" />
        <line x1="340" y1="310" x2="560" y2="310" stroke="#192538" strokeWidth="1.5" />
        <line x1="350" y1="200" x2="330" y2="310" stroke="#192538" strokeWidth="1.5" />
        <line x1="552" y1="200" x2="568" y2="310" stroke="#192538" strokeWidth="1.5" />

        {/* ===== BOULEVARD RING (inner) ===== */}
        <ellipse
          cx="450"
          cy="252"
          rx="88"
          ry="67"
          fill="none"
          stroke="#26384E"
          strokeWidth="2"
          strokeDasharray="7,5"
        />

        {/* ===== GARDEN RING ===== */}
        <ellipse
          cx="450"
          cy="254"
          rx="148"
          ry="110"
          fill="none"
          stroke="#223348"
          strokeWidth="2.5"
        />

        {/* ===== TTK ===== */}
        <ellipse
          cx="448"
          cy="258"
          rx="228"
          ry="168"
          fill="none"
          stroke="#1C2D40"
          strokeWidth="3.5"
        />

        {/* ===== MKAD (partial) ===== */}
        <ellipse
          cx="445"
          cy="264"
          rx="424"
          ry="304"
          fill="none"
          stroke="#162233"
          strokeWidth="4.5"
          strokeDasharray="14,9"
        />

        {/* ===== MOSCOW RIVER (Москва-река) ===== */}
        {/* Outer bank */}
        <path
          d="M 0 338 C 70 326 140 312 198 300 C 245 290 285 278 328 268 C 362 260 392 256 415 256 C 428 256 440 259 449 266 C 457 272 462 284 460 305 C 457 326 450 348 446 368 C 442 384 444 398 455 408 C 468 418 490 422 522 418 C 562 412 608 400 658 388 C 712 374 764 360 828 348 C 868 340 900 336 920 333"
          fill="none"
          stroke="#091D33"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Water body */}
        <path
          d="M 0 338 C 70 326 140 312 198 300 C 245 290 285 278 328 268 C 362 260 392 256 415 256 C 428 256 440 259 449 266 C 457 272 462 284 460 305 C 457 326 450 348 446 368 C 442 384 444 398 455 408 C 468 418 490 422 522 418 C 562 412 608 400 658 388 C 712 374 764 360 828 348 C 868 340 900 336 920 333"
          fill="none"
          stroke="#0F2E4A"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* River shimmer */}
        <path
          d="M 0 338 C 70 326 140 312 198 300 C 245 290 285 278 328 268 C 362 260 392 256 415 256 C 428 256 440 259 449 266 C 457 272 462 284 460 305 C 457 326 450 348 446 368 C 442 384 444 398 455 408 C 468 418 490 422 522 418 C 562 412 608 400 658 388 C 712 374 764 360 828 348 C 868 340 900 336 920 333"
          fill="none"
          stroke="#153D5E"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Kremlin block */}
        <rect x="428" y="244" width="40" height="30" rx="3" fill="#1A2535" opacity="0.9" />
        <text x="448" y="263" textAnchor="middle" fill="#2D4060" fontSize="7.5" fontFamily="Inter,sans-serif" fontWeight="600">
          КРЕМЛЬ
        </text>

        {/* Ring labels */}
        <text x="546" y="186" fill="#1D2E43" fontSize="8" fontFamily="Inter,sans-serif" transform="rotate(-13,546,186)">
          Садовое кольцо
        </text>
        <text x="684" y="108" fill="#192637" fontSize="8" fontFamily="Inter,sans-serif" transform="rotate(-22,684,108)">
          ТТК
        </text>
        <text x="748" y="54" fill="#152030" fontSize="7" fontFamily="Inter,sans-serif" transform="rotate(-22,748,54)">
          МКАД
        </text>

        {/* ===== CAR MARKERS ===== */}
        {vehicles.map((v) => {
          const color = statusColor(v.status);
          const isError = v.status === 'error';
          const isSelected = v.id === selectedId;
          const isHovered = v.id === hoveredId;
          const showTooltip = isHovered || isSelected;

          // Tooltip position (avoid edges)
          const tipX = v.mapX > 760 ? v.mapX - 102 : v.mapX + 10;
          const tipY = v.mapY > 420 ? v.mapY - 62 : v.mapY - 36;

          return (
            <g
              key={v.id}
              onClick={() => onSelectVehicle?.(v)}
              onMouseEnter={() => setHoveredId(v.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle
                  cx={v.mapX}
                  cy={v.mapY}
                  r="14"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.7"
                />
              )}

              {/* Error pulse rings */}
              {isError && (
                <>
                  <motion.circle
                    cx={v.mapX}
                    cy={v.mapY}
                    r={8}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    animate={{ r: [8, 24], opacity: [0.75, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'easeOut',
                    }}
                  />
                  <motion.circle
                    cx={v.mapX}
                    cy={v.mapY}
                    r={8}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1}
                    animate={{ r: [8, 18], opacity: [0.5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'easeOut',
                      delay: 0.6,
                    }}
                  />
                </>
              )}

              {/* Main marker dot */}
              <circle
                cx={v.mapX}
                cy={v.mapY}
                r={isError ? 6.5 : 5.5}
                fill={color}
                opacity="0.95"
                filter={
                  isError
                    ? 'url(#glow-red)'
                    : v.status === 'active'
                    ? 'url(#glow-green)'
                    : 'url(#glow-yellow)'
                }
              />
              {/* Inner white dot */}
              <circle
                cx={v.mapX}
                cy={v.mapY}
                r={isError ? 2.5 : 2}
                fill="rgba(255,255,255,0.7)"
              />

              {/* Tooltip */}
              {showTooltip && (
                <g>
                  <rect
                    x={tipX}
                    y={tipY}
                    width={94}
                    height={52}
                    rx="6"
                    fill="#111827"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.97"
                  />
                  <text
                    x={tipX + 9}
                    y={tipY + 16}
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {v.id}
                  </text>
                  <text
                    x={tipX + 9}
                    y={tipY + 29}
                    fill={color}
                    fontSize="8.5"
                    fontFamily="Inter,sans-serif"
                  >
                    {v.status === 'active'
                      ? `▶ ${v.speed} км/ч`
                      : v.status === 'charging'
                      ? `⚡ ${v.battery}% зарядка`
                      : `⚠ ${v.faults} ошибок`}
                  </text>
                  <text
                    x={tipX + 9}
                    y={tipY + 42}
                    fill="#6B7280"
                    fontSize="7.5"
                    fontFamily="Inter,sans-serif"
                  >
                    🔋 {v.battery}%  •  {v.connectivity}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* === HTML OVERLAYS === */}

      {/* LIVE badge */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: 'rgba(11,15,30,0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 9,
          padding: '5px 12px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#22C55E',
            flexShrink: 0,
          }}
        />
        <span
          style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: 1.2 }}
        >
          LIVE
        </span>
        <span style={{ fontSize: 10, color: '#4B5563', marginLeft: 2 }}>
          Москва • 15:42 МСК
        </span>
      </div>

      {/* Map layer controls */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <button style={mapBtnStyle}>
          <Plus size={14} />
        </button>
        <button style={mapBtnStyle}>
          <Minus size={14} />
        </button>
        <div style={{ height: 4 }} />
        <button style={mapBtnStyle}>
          <Navigation2 size={13} />
        </button>
        <button style={mapBtnStyle}>
          <Layers size={13} />
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          background: 'rgba(11,15,30,0.92)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10,
          padding: '9px 13px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: '#4B5563',
            fontWeight: 600,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          Статус
        </span>
        {[
          { color: '#22C55E', label: 'Активен' },
          { color: '#FFDD2D', label: 'Зарядка' },
          { color: '#EF4444', label: 'Ошибка системы' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 5px ${color}80`,
              }}
            />
            <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Status counters */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          display: 'flex',
          gap: 6,
        }}
      >
        {[
          { count: activeCount, label: 'На маршруте', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
          { count: chargingCount, label: 'Зарядка', color: '#FFDD2D', bg: 'rgba(255,221,45,0.12)' },
          { count: errorCount, label: 'Ошибка', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
        ].map(({ count, label, color, bg }) => (
          <div
            key={label}
            style={{
              background: 'rgba(11,15,30,0.92)',
              border: `1px solid ${color}30`,
              borderTop: `2px solid ${color}`,
              borderRadius: '0 0 8px 8px',
              padding: '5px 12px',
              textAlign: 'center',
              backdropFilter: 'blur(6px)',
              minWidth: 64,
            }}
          >
            <div
              style={{ fontSize: 16, fontWeight: 700, color, lineHeight: 1.2 }}
            >
              {count}
            </div>
            <div style={{ fontSize: 9, color: '#4B5563', marginTop: 2 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}