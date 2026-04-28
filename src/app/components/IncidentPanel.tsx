import { useState } from 'react';
import {
  AlertTriangle,
  Battery,
  MapPin,
  Zap,
  RefreshCw,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../data/vehicles';

interface IncidentPanelProps {
  incidents: Vehicle[];
  onAction?: (id: string) => void;
}

const faultDescription = (faults: number): string => {
  if (faults >= 7) return 'Множественные критич. отказы';
  if (faults >= 5) return 'Аварийная остановка';
  if (faults >= 4) return 'Потеря связи + GPS';
  if (faults >= 3) return 'Критический разряд';
  if (faults >= 2) return 'Ошибка GPS / ИНС';
  return 'Предупреждение сенсора';
};

const priorityLabel = ['P1', 'P2', 'P3', 'P4', 'P5'];

export function IncidentPanel({ incidents, onAction }: IncidentPanelProps) {
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  const handleAction = (id: string) => {
    setResolved((prev) => new Set([...prev, id]));
    onAction?.(id);
  };

  const activeIncidents = incidents.filter((v) => !resolved.has(v.id));

  return (
    <div
      style={{
        flex: '0 0 30%',
        background: '#FFFFFF',
        borderLeft: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: '#FAFAFA',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={14} color="#EF4444" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1D23' }}>
            Активные инциденты
          </span>
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#FFFFFF',
              background: '#EF4444',
              borderRadius: 10,
              padding: '2px 7px',
            }}
          >
            {activeIncidents.length}
          </motion.span>
        </div>
        <button
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'transparent',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Alert banner */}
      <div
        style={{
          margin: '10px 12px 6px',
          padding: '7px 11px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 8,
          fontSize: 11,
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.3 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#EF4444',
            flexShrink: 0,
          }}
        />
        <span style={{ fontWeight: 500 }}>
          Требуется вмешательство оператора
        </span>
      </div>

      {/* Cards scroll area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 12px 12px',
        }}
      >
        <AnimatePresence>
          {activeIncidents.map((incident, i) => {
            const priority = priorityLabel[i] || `P${i + 1}`;
            const isCritical = incident.battery < 15 || incident.faults >= 4;

            return (
              <motion.div
                key={incident.id}
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginBottom: 10,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderLeft: `3px solid ${isCritical ? '#EF4444' : '#F59E0B'}`,
                  borderRadius: '0 12px 12px 0',
                  overflow: 'hidden',
                  boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                }}
              >
                {/* Card top strip */}
                {isCritical && (
                  <div
                    style={{
                      height: 3,
                      background:
                        'repeating-linear-gradient(90deg, #EF4444 0, #EF4444 8px, transparent 8px, transparent 16px)',
                      opacity: 0.4,
                    }}
                  />
                )}

                <div style={{ padding: '11px 12px' }}>
                  {/* Header row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#1A1D23',
                          background: '#F6F7F9',
                          padding: '2px 8px',
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        {incident.id}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: isCritical ? '#EF4444' : '#D97706',
                          background: isCritical ? '#FEF2F2' : '#FFFBEB',
                          padding: '2px 6px',
                          borderRadius: 4,
                          border: `1px solid ${isCritical ? '#FECACA' : '#FDE68A'}`,
                        }}
                      >
                        {priority}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        color: '#9CA3AF',
                        fontSize: 10,
                      }}
                    >
                      <Clock size={9} />
                      <span>{incident.lastSeen}</span>
                    </div>
                  </div>

                  {/* Fault description */}
                  <div
                    style={{
                      fontSize: 11,
                      color: '#DC2626',
                      fontWeight: 600,
                      marginBottom: 9,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <AlertTriangle size={10} />
                    {faultDescription(incident.faults)}
                  </div>

                  {/* Stats mini-grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 7,
                      marginBottom: 9,
                    }}
                  >
                    {/* Battery */}
                    <div
                      style={{
                        padding: '7px 9px',
                        background:
                          incident.battery < 15 ? '#FEF2F2' : '#F8FAFC',
                        borderRadius: 9,
                        border: `1px solid ${
                          incident.battery < 15 ? '#FECACA' : '#E2E8F0'
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          marginBottom: 4,
                        }}
                      >
                        <Battery
                          size={10}
                          color={
                            incident.battery < 15 ? '#EF4444' : '#9CA3AF'
                          }
                        />
                        <span style={{ fontSize: 9, color: '#9CA3AF' }}>
                          Батарея
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color:
                            incident.battery < 15 ? '#EF4444' : '#374151',
                          lineHeight: 1.1,
                        }}
                      >
                        {incident.battery}%
                      </div>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: 3,
                          background: '#E2E8F0',
                          borderRadius: 2,
                          marginTop: 5,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${incident.battery}%`,
                            background:
                              incident.battery < 20 ? '#EF4444' : '#22C55E',
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>

                    {/* Faults */}
                    <div
                      style={{
                        padding: '7px 9px',
                        background: '#FEF2F2',
                        borderRadius: 9,
                        border: '1px solid #FECACA',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          marginBottom: 4,
                        }}
                      >
                        <Zap size={10} color="#EF4444" />
                        <span style={{ fontSize: 9, color: '#9CA3AF' }}>
                          Ошибок
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#EF4444',
                          lineHeight: 1.1,
                        }}
                      >
                        {incident.faults}
                      </div>
                      <div
                        style={{ fontSize: 9, color: '#DC2626', marginTop: 5 }}
                      >
                        критических
                      </div>
                    </div>
                  </div>

                  {/* Location row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 5,
                      fontSize: 11,
                      color: '#6B7280',
                      marginBottom: 8,
                    }}
                  >
                    <MapPin size={10} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ lineHeight: 1.3 }}>{incident.location}</span>
                  </div>

                  {/* Connectivity + model row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 5,
                        background:
                          incident.connectivity === 'Нет сигнала'
                            ? '#FEF2F2'
                            : '#EFF6FF',
                        color:
                          incident.connectivity === 'Нет сигнала'
                            ? '#DC2626'
                            : '#2563EB',
                        border: `1px solid ${
                          incident.connectivity === 'Нет сигнала'
                            ? '#FECACA'
                            : '#BFDBFE'
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {incident.connectivity === 'Нет сигнала' ? (
                        <WifiOff size={9} />
                      ) : (
                        <Wifi size={9} />
                      )}
                      {incident.connectivity === 'Нет сигнала'
                        ? 'Нет сигнала'
                        : incident.connectivity}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#9CA3AF',
                        background: '#F6F7F9',
                        padding: '2px 7px',
                        borderRadius: 4,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {incident.model}
                    </span>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleAction(incident.id)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#FFDD2D',
                      border: 'none',
                      borderRadius: 9,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#111827',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s',
                      boxShadow: '0 1px 4px rgba(255,221,45,0.35)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#FFE85A')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '#FFDD2D')
                    }
                  >
                    <CheckCircle size={13} />
                    Принять инцидент
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeIncidents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '40px 20px',
              color: '#9CA3AF',
              textAlign: 'center',
            }}
          >
            <CheckCircle size={32} color="#22C55E" />
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}
              >
                Все инциденты закрыты
              </div>
              <div style={{ fontSize: 11 }}>
                Флот работает в штатном режиме
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
