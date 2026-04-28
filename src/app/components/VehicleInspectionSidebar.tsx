import { useState } from 'react';
import type { ElementType, ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  StopCircle,
  RefreshCw,
  Wrench,
  Clock,
  Navigation2,
  Radio,
  Eye,
  Activity,
  Battery,
  Wifi,
  WifiOff,
  MapPin,
  Thermometer,
  Cpu,
  Zap,
  Shield,
  Server,
} from 'lucide-react';
import { Vehicle } from '../data/vehicles';

// ─── Constants ───────────────────────────────────────────────────────────────

const RING_R = 78;
const RING_C = 2 * Math.PI * RING_R; // 490.09

const FAULT_LIBRARY = [
  {
    code: 'ERR-BMS-0x4A',
    name: 'Battery BMS Fault',
    severity: 'critical',
    component: 'Power System',
    time: '08:14:23',
  },
  {
    code: 'ERR-LDR-0x12',
    name: 'LiDAR Sensor Timeout',
    severity: 'critical',
    component: 'Sensor Array',
    time: '08:14:25',
  },
  {
    code: 'ERR-GPS-0x07',
    name: 'GPS Signal Loss',
    severity: 'critical',
    component: 'Navigation',
    time: '08:14:25',
  },
  {
    code: 'ERR-EST-0x01',
    name: 'Emergency Stop Trigger',
    severity: 'critical',
    component: 'Safety System',
    time: '08:14:28',
  },
  {
    code: 'ERR-CAN-0x3B',
    name: 'CAN Bus Error',
    severity: 'warning',
    component: 'Network Bus',
    time: '08:14:30',
  },
  {
    code: 'ERR-CAM-0x05',
    name: 'Rear Camera Fault',
    severity: 'warning',
    component: 'Sensor Array',
    time: '08:14:31',
  },
  {
    code: 'ERR-IMU-0x22',
    name: 'IMU Calibration Drift',
    severity: 'warning',
    component: 'Navigation',
    time: '08:14:35',
  },
];

const batteryColors = (pct: number) => {
  if (pct > 50) return { arc: '#22C55E', track: '#DCFCE7', text: '#15803D', label: 'НОРМА' };
  if (pct > 20) return { arc: '#F59E0B', track: '#FEF3C7', text: '#B45309', label: 'НИЗКИЙ УРОВЕНЬ' };
  return { arc: '#EF4444', track: '#FEE2E2', text: '#DC2626', label: 'КРИТИЧЕСКИЙ УРОВЕНЬ' };
};

const statusCfg = {
  active: { label: 'Активен', bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  charging: { label: 'Зарядка', bg: '#FEFCE8', color: '#A16207', border: '#FDE68A' },
  error: { label: 'Системная ошибка', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSensors(faults: number) {
  return [
    {
      name: 'LiDAR 360°',
      status: faults >= 2 ? 'error' : 'ok',
      value: faults >= 2 ? 'Timeout' : 'OK • 120m range',
      icon: Radio,
    },
    {
      name: 'Camera Array 6×',
      status: faults >= 5 ? 'warning' : 'ok',
      value: faults >= 5 ? '5 / 6 Active' : '6 / 6 Active',
      icon: Eye,
    },
    {
      name: 'Ultrasonic 12×',
      status: faults >= 4 ? 'warning' : 'ok',
      value: faults >= 4 ? '10 / 12 Active' : '12 / 12 Active',
      icon: Activity,
    },
    {
      name: 'IMU / Гироскоп',
      status: faults >= 3 ? 'warning' : 'ok',
      value: faults >= 3 ? 'Деградация ±1.2°' : 'Calibrated',
      icon: Navigation2,
    },
    {
      name: 'RADAR Forward',
      status: 'ok',
      value: 'OK • 200m range',
      icon: Shield,
    },
  ];
}

function getPower(vehicle: Vehicle) {
  const isError = vehicle.status === 'error';
  return [
    {
      name: 'Основной пакет',
      value: `${vehicle.battery}%`,
      status: vehicle.battery < 20 ? 'critical' : 'ok',
    },
    { name: 'Вспомог. батарея', value: '45%', status: 'ok' },
    {
      name: 'BMS статус',
      value: isError ? 'Отказ (0x4A)' : 'OK',
      status: isError ? 'critical' : 'ok',
    },
    {
      name: 'Темп. аккумулятора',
      value: isError ? '54°C' : '28°C',
      status: isError ? 'warning' : 'ok',
    },
    {
      name: 'Ток разряда',
      value: vehicle.speed > 0 ? '85 A' : '0 A',
      status: 'ok',
    },
  ];
}

function getNetwork(vehicle: Vehicle) {
  const hasSignal = vehicle.connectivity !== 'Нет сигнала';
  return [
    {
      name: '5G NR',
      status: vehicle.connectivity === '5G' ? 'ok' : 'offline',
      rssi: vehicle.connectivity === '5G' ? '−65 dBm' : 'N/A',
    },
    {
      name: 'LTE 4G',
      status: hasSignal ? 'ok' : 'offline',
      rssi: hasSignal ? '−82 dBm' : 'N/A',
    },
    { name: 'WiFi 6', status: 'scanning', rssi: '...' },
    {
      name: 'V2X / DSRC',
      status: hasSignal ? 'ok' : 'offline',
      rssi: hasSignal ? '−71 dBm' : 'N/A',
    },
  ];
}

// ─── Island card ─────────────────────────────────────────────────────────────

function Island({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: '14px 15px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionTitle({
  icon: Icon,
  label,
  color = '#6B7280',
}: {
  icon: ElementType;
  label: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
      }}
    >
      <Icon size={13} color={color} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#9CA3AF',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Accordion ───────────────────────────────────────────────────────────────

function Accordion({
  title,
  badge,
  badgeColor = '#EF4444',
  children,
  defaultOpen = false,
}: {
  title: string;
  badge?: string | number;
  badgeColor?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 7,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 12px',
          background: open ? '#FAFAFA' : '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          gap: 8,
          transition: 'background 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#1A1D23',
              textAlign: 'left',
            }}
          >
            {title}
          </span>
          {badge != null && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#FFFFFF',
                background: badgeColor,
                borderRadius: 9,
                padding: '1px 6px',
                flexShrink: 0,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, color: '#9CA3AF' }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                borderTop: '1px solid #F1F5F9',
                padding: '10px 12px',
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Ring Chart ───────────────────────────────────────────────────────────────

function BatteryRing({ battery }: { battery: number }) {
  const colors = batteryColors(battery);
  const dashOffset = RING_C * (1 - battery / 100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ position: 'relative' }}>
        <svg
          viewBox="0 0 200 200"
          style={{ width: 164, height: 164, display: 'block' }}
        >
          {/* Tick marks */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i * 10 - 90) * (Math.PI / 180);
            const isMajor = i % 9 === 0;
            const r1 = isMajor ? 92 : 94;
            const r2 = 100;
            return (
              <line
                key={i}
                x1={100 + r1 * Math.cos(angle)}
                y1={100 + r1 * Math.sin(angle)}
                x2={100 + r2 * Math.cos(angle)}
                y2={100 + r2 * Math.sin(angle)}
                stroke={isMajor ? '#D1D5DB' : '#E5E7EB'}
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
            );
          })}

          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={RING_R}
            fill="none"
            stroke={colors.track}
            strokeWidth={13}
          />

          {/* Animated progress arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={RING_R}
            fill="none"
            stroke={colors.arc}
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={`${RING_C} ${RING_C}`}
            initial={{ strokeDashoffset: RING_C }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, delay: 0.25, ease: 'easeOut' }}
            transform="rotate(-90 100 100)"
          />

          {/* Inner shadow ring */}
          <circle
            cx="100"
            cy="100"
            r={RING_R - 7}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Center: % value */}
          <text
            x="100"
            y="92"
            textAnchor="middle"
            fill={colors.text}
            fontSize="34"
            fontWeight="800"
            fontFamily="Inter, sans-serif"
          >
            {battery}%
          </text>

          {/* Center: label */}
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fill={colors.arc}
            fontSize="8.5"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.6"
          >
            {colors.label}
          </text>

          {/* Center: capacity */}
          <text
            x="100"
            y="126"
            textAnchor="middle"
            fill="#CBD5E1"
            fontSize="7.5"
            fontFamily="Inter, sans-serif"
          >
            82 kWh LiFePO₄
          </text>
        </svg>

        {/* Blinking indicator for critical */}
        {battery < 20 && (
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#EF4444',
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 6px rgba(239,68,68,0.6)',
            }}
          />
        )}
      </div>

      {/* Battery stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 6,
          width: '100%',
        }}
      >
        {[
          { label: 'Заряд', value: `${battery}%`, color: colors.text },
          { label: 'Запас хода', value: battery < 10 ? '< 12 km' : `${Math.round(battery * 5.2)} km`, color: '#374151' },
          { label: 'Зарядка', value: battery < 50 ? '~2.4 ч' : '—', color: '#6B7280' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              padding: '6px 8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>
              {label}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: 'ok' | 'warning' | 'error' | 'critical' | 'offline' | 'scanning' }) {
  const colors = {
    ok: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    critical: '#EF4444',
    offline: '#9CA3AF',
    scanning: '#3B82F6',
  };
  return (
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: colors[status] || '#9CA3AF',
        flexShrink: 0,
      }}
    />
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

interface VehicleInspectionSidebarProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function VehicleInspectionSidebar({
  vehicle,
  onClose,
}: VehicleInspectionSidebarProps) {
  const [stopConfirm, setStopConfirm] = useState(false);
  const [rebooting, setRebooting] = useState(false);

  const handleReboot = () => {
    setRebooting(true);
    setTimeout(() => setRebooting(false), 3000);
  };

  const activeFaults = vehicle ? FAULT_LIBRARY.slice(0, vehicle.faults) : [];
  const sensors = vehicle ? getSensors(vehicle.faults) : [];
  const powerItems = vehicle ? getPower(vehicle) : [];
  const networkItems = vehicle ? getNetwork(vehicle) : [];

  const cfg = vehicle ? statusCfg[vehicle.status] : null;
  const batteryCol = vehicle ? batteryColors(vehicle.battery) : null;

  // Approximate lat/lon from map coordinates
  const lat = vehicle ? (55.92 - (vehicle.mapY / 480) * 0.34).toFixed(4) : '0';
  const lon = vehicle ? (37.37 + (vehicle.mapX / 900) * 0.52).toFixed(4) : '0';

  return (
    <AnimatePresence>
      {vehicle && (
        <motion.div
          key="inspection-sidebar"
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          style={{
            position: 'fixed',
            top: 60,
            right: 0,
            bottom: 0,
            width: 364,
            background: '#F6F7F9',
            borderLeft: '1px solid #E2E8F0',
            boxShadow: '-6px 0 28px rgba(0,0,0,0.10)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 300,
            overflow: 'hidden',
          }}
        >
          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div
            style={{
              background: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              padding: '13px 15px 12px',
              flexShrink: 0,
            }}
          >
            {/* Top row: ID + close */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: batteryCol?.arc,
                      boxShadow: `0 0 7px ${batteryCol?.arc}80`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#1A1D23',
                      letterSpacing: 0.5,
                    }}
                  >
                    {vehicle.id}
                  </span>
                </div>

                {/* Status badge */}
                {cfg && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      color: cfg.color,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 8,
                      padding: '3px 10px',
                    }}
                  >
                    {vehicle.status === 'error' && (
                      <AlertTriangle size={11} />
                    )}
                    {vehicle.status === 'active' && (
                      <CheckCircle size={11} />
                    )}
                    {vehicle.status === 'charging' && <Zap size={11} />}
                    {cfg.label}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  background: '#F6F7F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Meta row */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                fontSize: 11,
                color: '#9CA3AF',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Cpu size={10} />
                {vehicle.model}
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Clock size={10} />
                {vehicle.lastSeen} назад
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <MapPin size={10} />
                {vehicle.location.split(',')[0]}
              </span>
            </div>
          </div>

          {/* ── SCROLLABLE CONTENT ──���───────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 12px 12px',
            }}
          >
            {/* ── BATTERY STATUS ── */}
            <Island>
              <SectionTitle icon={Battery} label="Состояние батареи" color={batteryCol?.arc} />
              <BatteryRing battery={vehicle.battery} />
            </Island>

            {/* ── DIAGNOSTICS (ACCORDIONS) ── */}
            <Island style={{ padding: '14px 15px' }}>
              <SectionTitle icon={AlertTriangle} label="Техническая диагностика" color="#EF4444" />

              {/* 1. Active Errors */}
              <Accordion
                title={`Активные ошибки`}
                badge={activeFaults.length}
                badgeColor="#EF4444"
                defaultOpen={true}
              >
                {activeFaults.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: '#22C55E',
                    }}
                  >
                    <CheckCircle size={13} />
                    Ошибок не обнаружено
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    {activeFaults.map((fault) => (
                      <div
                        key={fault.code}
                        style={{
                          background:
                            fault.severity === 'critical'
                              ? '#FEF2F2'
                              : '#FFFBEB',
                          border: `1px solid ${
                            fault.severity === 'critical'
                              ? '#FECACA'
                              : '#FDE68A'
                          }`,
                          borderLeft: `3px solid ${
                            fault.severity === 'critical'
                              ? '#EF4444'
                              : '#F59E0B'
                          }`,
                          borderRadius: '0 8px 8px 0',
                          padding: '7px 9px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 2,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color:
                                fault.severity === 'critical'
                                  ? '#DC2626'
                                  : '#B45309',
                            }}
                          >
                            {fault.name}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              color: '#9CA3AF',
                              flexShrink: 0,
                              marginLeft: 6,
                            }}
                          >
                            {fault.time}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 9,
                              color: '#6B7280',
                              background: 'rgba(0,0,0,0.04)',
                              padding: '1px 5px',
                              borderRadius: 3,
                            }}
                          >
                            {fault.code}
                          </span>
                          <span style={{ fontSize: 9, color: '#9CA3AF' }}>
                            {fault.component}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Accordion>

              {/* 2. Sensor Status */}
              <Accordion
                title="Статус сенсоров"
                badge={
                  sensors.filter((s) => s.status !== 'ok').length || undefined
                }
                badgeColor="#F59E0B"
                defaultOpen={vehicle.faults >= 2}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                  }}
                >
                  {sensors.map((sensor) => {
                    const SIcon = sensor.icon;
                    const statusColor =
                      sensor.status === 'ok'
                        ? '#22C55E'
                        : sensor.status === 'warning'
                        ? '#F59E0B'
                        : '#EF4444';
                    return (
                      <div
                        key={sensor.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 0',
                          borderBottom: '1px solid #F1F5F9',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                          }}
                        >
                          <SIcon size={11} color={statusColor} />
                          <span
                            style={{ fontSize: 11, color: '#374151' }}
                          >
                            {sensor.name}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              color: statusColor,
                              fontWeight: 600,
                            }}
                          >
                            {sensor.value}
                          </span>
                          <StatusDot
                            status={
                              sensor.status as
                                | 'ok'
                                | 'warning'
                                | 'error'
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Accordion>

              {/* 3. Power Management */}
              <Accordion title="Управление питанием" defaultOpen={false}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                  }}
                >
                  {powerItems.map((item) => {
                    const c =
                      item.status === 'critical'
                        ? '#EF4444'
                        : item.status === 'warning'
                        ? '#F59E0B'
                        : '#374151';
                    return (
                      <div
                        key={item.name}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 0',
                          borderBottom: '1px solid #F1F5F9',
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#6B7280' }}>
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: c,
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Accordion>

              {/* 4. Network Status */}
              <Accordion title="Состояние связи" defaultOpen={false}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                  }}
                >
                  {networkItems.map((net) => (
                    <div
                      key={net.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: '1px solid #F1F5F9',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {net.status === 'offline' ? (
                          <WifiOff size={11} color="#9CA3AF" />
                        ) : net.status === 'scanning' ? (
                          <Wifi size={11} color="#3B82F6" />
                        ) : (
                          <Wifi size={11} color="#22C55E" />
                        )}
                        <span style={{ fontSize: 11, color: '#374151' }}>
                          {net.name}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color:
                              net.status === 'ok'
                                ? '#374151'
                                : net.status === 'scanning'
                                ? '#3B82F6'
                                : '#9CA3AF',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {net.rssi}
                        </span>
                        <StatusDot
                          status={
                            net.status as
                              | 'ok'
                              | 'offline'
                              | 'scanning'
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>
            </Island>

            {/* ── LIVE TELEMETRY ── */}
            <Island>
              <SectionTitle icon={Activity} label="Живая телеметрия" />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 7,
                  marginBottom: 7,
                }}
              >
                {/* Speed */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '8px 10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 3,
                    }}
                  >
                    <Navigation2 size={9} color="#9CA3AF" />
                    <span style={{ fontSize: 9, color: '#9CA3AF' }}>
                      Скорость
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#1A1D23',
                      lineHeight: 1.1,
                    }}
                  >
                    {vehicle.speed}
                    <span
                      style={{
                        fontSize: 10,
                        color: '#9CA3AF',
                        fontWeight: 400,
                        marginLeft: 3,
                      }}
                    >
                      км/ч
                    </span>
                  </div>
                </div>

                {/* Temperature */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '8px 10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 3,
                    }}
                  >
                    <Thermometer size={9} color="#9CA3AF" />
                    <span style={{ fontSize: 9, color: '#9CA3AF' }}>
                      Темп. внутри
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#1A1D23',
                      lineHeight: 1.1,
                    }}
                  >
                    {vehicle.status === 'error' ? 24 : 22}
                    <span
                      style={{
                        fontSize: 10,
                        color: '#9CA3AF',
                        fontWeight: 400,
                        marginLeft: 3,
                      }}
                    >
                      °C
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordinates + other */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '9px 11px',
                }}
              >
                {[
                  {
                    label: 'Широта',
                    value: `${lat}° N`,
                    icon: MapPin,
                    mono: true,
                  },
                  {
                    label: 'Долгота',
                    value: `${lon}° E`,
                    icon: MapPin,
                    mono: true,
                  },
                  {
                    label: 'Направление',
                    value: vehicle.speed > 0 ? 'СЗ / 312°' : 'N/A',
                    icon: Navigation2,
                    mono: false,
                  },
                  {
                    label: 'Последний GPS',
                    value:
                      vehicle.status === 'error'
                        ? vehicle.lastSeen + ' назад'
                        : '00:00:01 назад',
                    icon: Clock,
                    mono: false,
                  },
                  {
                    label: 'Время работы',
                    value: '04:22:15',
                    icon: Server,
                    mono: false,
                  },
                ].map(({ label, value, icon: TIcon, mono }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '3px 0',
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <TIcon size={10} color="#9CA3AF" />
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                        {label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: mono ? 'monospace' : 'inherit',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Island>

            {/* bottom spacer for the fixed action buttons */}
            <div style={{ height: 8 }} />
          </div>

          {/* ── ACTION BUTTONS (bottom-anchored) ───────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              padding: '12px 12px 14px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            {/* Emergency Stop */}
            <AnimatePresence mode="wait">
              {!stopConfirm ? (
                <motion.button
                  key="stop-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setStopConfirm(true)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#EF4444',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
                    transition: 'background 0.15s',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StopCircle size={15} />
                  Аварийная остановка
                </motion.button>
              ) : (
                <motion.div
                  key="stop-confirm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #EF4444',
                    borderRadius: 12,
                    padding: '10px 12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#DC2626',
                      marginBottom: 8,
                      textAlign: 'center',
                    }}
                  >
                    ⚠ Подтвердите аварийную остановку?
                  </div>
                  <div style={{ display: 'flex', gap: 7 }}>
                    <button
                      onClick={() => setStopConfirm(false)}
                      style={{
                        flex: 1,
                        padding: '7px',
                        background: 'transparent',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#6B7280',
                      }}
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => setStopConfirm(false)}
                      style={{
                        flex: 1,
                        padding: '7px',
                        background: '#EF4444',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#FFFFFF',
                      }}
                    >
                      Подтвердить
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* System Reboot */}
            <button
              onClick={handleReboot}
              disabled={rebooting}
              style={{
                width: '100%',
                padding: '9px',
                background: rebooting ? '#F1F5F9' : '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: 12,
                cursor: rebooting ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: rebooting ? '#9CA3AF' : '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                transition: 'all 0.15s',
              }}
            >
              <motion.span
                animate={rebooting ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  rebooting
                    ? { repeat: Infinity, duration: 1, ease: 'linear' }
                    : {}
                }
                style={{ display: 'flex' }}
              >
                <RefreshCw size={14} />
              </motion.span>
              {rebooting ? 'Перезагрузка...' : 'Перезагрузка системы'}
            </button>

            {/* Route to Service */}
            <button
              style={{
                width: '100%',
                padding: '9px',
                background: '#FFFBCC',
                border: '1.5px solid #FFDD2D',
                borderRadius: 12,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                transition: 'all 0.15s',
              }}
            >
              <Wrench size={14} />
              Направить на сервис
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}