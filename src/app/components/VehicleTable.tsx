import { useState } from 'react';
import type { ElementType } from 'react';
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Zap,
  MapPin,
  Cpu,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../data/vehicles';

interface VehicleTableProps {
  vehicles: Vehicle[];
  selectedId?: string;
  onSelectVehicle?: (id: string) => void;
}

type SortKey = 'id' | 'status' | 'battery' | 'faults' | 'speed';
type SortDir = 'asc' | 'desc';

const statusConfig: Record<
  VehicleStatus,
  { label: string; bg: string; color: string; border: string; icon: ElementType }
> = {
  active: {
    label: 'Активен',
    bg: '#F0FDF4',
    color: '#15803D',
    border: '#BBF7D0',
    icon: CheckCircle,
  },
  charging: {
    label: 'Зарядка',
    bg: '#FEFCE8',
    color: '#A16207',
    border: '#FDE68A',
    icon: Zap,
  },
  error: {
    label: 'Ошибка',
    bg: '#FEF2F2',
    color: '#DC2626',
    border: '#FECACA',
    icon: AlertCircle,
  },
};

const filterOptions = [
  { key: 'all', label: 'Все ТС' },
  { key: 'active', label: 'Активные' },
  { key: 'charging', label: 'Зарядка' },
  { key: 'error', label: 'С ошибкой' },
];

const columns = [
  { key: 'id', label: 'ID транспорта', sortable: true, width: 130 },
  { key: 'status', label: 'Статус', sortable: true, width: 120 },
  { key: 'battery', label: 'Заряд батареи', sortable: true, width: 160 },
  { key: 'connectivity', label: 'Связь', sortable: false, width: 100 },
  { key: 'faults', label: 'Ошибки системы', sortable: true, width: 130 },
  { key: 'speed', label: 'Скорость', sortable: true, width: 100 },
  { key: 'location', label: 'Местоположение', sortable: false, width: 200 },
  { key: 'model', label: 'Модель', sortable: false, width: 110 },
];

export function VehicleTable({ vehicles, selectedId, onSelectVehicle }: VehicleTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filter, setFilter] = useState<string>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = vehicles.filter(
    (v) => filter === 'all' || v.status === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortKey as keyof Vehicle] as string | number;
    const valB = b[sortKey as keyof Vehicle] as string | number;
    if (typeof valA === 'string') {
      return sortDir === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortDir === 'asc'
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const counts = {
    all: vehicles.length,
    active: vehicles.filter((v) => v.status === 'active').length,
    charging: vehicles.filter((v) => v.status === 'charging').length,
    error: vehicles.filter((v) => v.status === 'error').length,
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {/* Table toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid #E2E8F0',
          flexShrink: 0,
          background: '#FAFAFA',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={14} color="#6B7280" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1D23' }}>
              Реестр транспортных средств
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              color: '#6B7280',
              background: '#F6F7F9',
              border: '1px solid #E2E8F0',
              padding: '2px 9px',
              borderRadius: 12,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {sorted.length} из {vehicles.length} ТС
          </span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {filterOptions.map(({ key, label }) => {
            const isActive = filter === key;
            const count = counts[key as keyof typeof counts];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 7,
                  border: isActive ? '1px solid #FFDD2D' : '1px solid #E2E8F0',
                  background: isActive ? '#FFFBCC' : 'transparent',
                  color: isActive ? '#1A1D23' : '#6B7280',
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.12s',
                }}
              >
                {label}
                <span
                  style={{
                    fontSize: 10,
                    padding: '0 5px',
                    borderRadius: 8,
                    background: isActive ? 'rgba(0,0,0,0.1)' : '#F3F4F6',
                    color: isActive ? '#1A1D23' : '#9CA3AF',
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 900,
          }}
        >
          <thead>
            <tr
              style={{
                background: '#F8FAFC',
                borderBottom: '2px solid #E2E8F0',
                position: 'sticky',
                top: 0,
                zIndex: 2,
              }}
            >
              {columns.map(({ key, label, sortable, width }) => {
                const isSort = sortKey === key;
                return (
                  <th
                    key={key}
                    onClick={sortable ? () => handleSort(key as SortKey) : undefined}
                    style={{
                      padding: '8px 16px',
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 700,
                      color: isSort ? '#FFDD2D' : '#9CA3AF',
                      letterSpacing: 0.6,
                      textTransform: 'uppercase',
                      cursor: sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width,
                      minWidth: width,
                      borderRight: '1px solid #F1F5F9',
                      background: isSort
                        ? 'rgba(255,221,45,0.06)'
                        : 'transparent',
                      transition: 'all 0.12s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {label}
                      {sortable && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {isSort ? (
                            sortDir === 'asc' ? (
                              <ChevronUp size={11} color="#FFDD2D" />
                            ) : (
                              <ChevronDown size={11} color="#FFDD2D" />
                            )
                          ) : (
                            <ArrowUpDown size={10} color="#CBD5E1" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((vehicle, i) => {
              const cfg = statusConfig[vehicle.status];
              const StatusIcon = cfg.icon;
              const batteryColor =
                vehicle.battery > 50
                  ? '#22C55E'
                  : vehicle.battery > 20
                  ? '#F59E0B'
                  : '#EF4444';
              const isErrorRow = vehicle.status === 'error';

              return (
                <tr
                  key={vehicle.id}
                  onClick={() => onSelectVehicle?.(vehicle.id)}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background:
                      selectedId === vehicle.id
                        ? 'rgba(255,221,45,0.08)'
                        : isErrorRow
                        ? 'rgba(254,242,242,0.45)'
                        : i % 2 === 0
                        ? '#FFFFFF'
                        : '#FAFBFC',
                    transition: 'background 0.1s',
                    cursor: 'pointer',
                    outline:
                      selectedId === vehicle.id
                        ? '2px solid #FFDD2D'
                        : 'none',
                    outlineOffset: '-2px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      selectedId === vehicle.id
                        ? 'rgba(255,221,45,0.12)'
                        : isErrorRow
                        ? 'rgba(254,226,226,0.6)'
                        : '#F0F4FF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      selectedId === vehicle.id
                        ? 'rgba(255,221,45,0.08)'
                        : isErrorRow
                        ? 'rgba(254,242,242,0.45)'
                        : i % 2 === 0
                        ? '#FFFFFF'
                        : '#FAFBFC')
                  }
                >
                  {/* Vehicle ID */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background:
                            vehicle.status === 'active'
                              ? '#22C55E'
                              : vehicle.status === 'charging'
                              ? '#FFDD2D'
                              : '#EF4444',
                          flexShrink: 0,
                          boxShadow:
                            vehicle.status === 'error'
                              ? '0 0 0 3px rgba(239,68,68,0.15)'
                              : 'none',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#1A1D23',
                          letterSpacing: 0.3,
                        }}
                      >
                        {vehicle.id}
                      </span>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 10px 3px 7px',
                        borderRadius: 20,
                        background: cfg.bg,
                        color: cfg.color,
                        border: `1px solid ${cfg.border}`,
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <StatusIcon size={10} />
                      {cfg.label}
                    </span>
                  </td>

                  {/* Battery */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: '#E2E8F0',
                          borderRadius: 3,
                          overflow: 'hidden',
                          minWidth: 70,
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${vehicle.battery}%`,
                            background: batteryColor,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: batteryColor,
                          minWidth: 34,
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {vehicle.battery}%
                      </span>
                    </div>
                  </td>

                  {/* Connectivity */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {vehicle.connectivity === 'Нет сигнала' ? (
                        <>
                          <WifiOff size={12} color="#EF4444" />
                          <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 500 }}>
                            Нет
                          </span>
                        </>
                      ) : (
                        <>
                          <Wifi size={12} color="#22C55E" />
                          <span style={{ fontSize: 11, color: '#374151' }}>
                            {vehicle.connectivity}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* System faults */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                    }}
                  >
                    {vehicle.faults === 0 ? (
                      <span
                        style={{
                          fontSize: 11,
                          color: '#22C55E',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontWeight: 500,
                        }}
                      >
                        <CheckCircle size={12} />
                        Норма
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            background:
                              vehicle.faults >= 5
                                ? '#EF4444'
                                : vehicle.faults >= 2
                                ? '#F59E0B'
                                : '#94A3B8',
                            borderRadius: 6,
                            padding: '1px 8px',
                          }}
                        >
                          {vehicle.faults}
                        </span>
                        <span style={{ fontSize: 10, color: '#6B7280' }}>
                          {vehicle.faults >= 5
                            ? 'крит.'
                            : vehicle.faults >= 2
                            ? 'серьёз.'
                            : 'незнач.'}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Speed */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                    }}
                  >
                    {vehicle.status === 'active' ? (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#374151',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {vehicle.speed}{' '}
                        <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400 }}>
                          км/ч
                        </span>
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>
                    )}
                  </td>

                  {/* Location */}
                  <td
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid #F1F5F9',
                      maxWidth: 200,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin
                        size={10}
                        color="#9CA3AF"
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: '#374151',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {vehicle.location}
                      </span>
                    </div>
                  </td>

                  {/* Model */}
                  <td style={{ padding: '10px 16px' }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#9CA3AF',
                        background: '#F6F7F9',
                        border: '1px solid #E2E8F0',
                        padding: '2px 8px',
                        borderRadius: 5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {vehicle.model}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              color: '#9CA3AF',
              fontSize: 13,
            }}
          >
            Нет данных по выбранному фильтру
          </div>
        )}
      </div>

      {/* Table footer */}
      <div
        style={{
          padding: '6px 20px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: '#F8FAFC',
        }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            {
              label: 'Активных',
              value: counts.active,
              color: '#22C55E',
            },
            {
              label: 'На зарядке',
              value: counts.charging,
              color: '#F59E0B',
            },
            {
              label: 'С ошибкой',
              value: counts.error,
              color: '#EF4444',
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: color,
                }}
              />
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{label}:</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 10, color: '#CBD5E1' }}>
          Обновлено: 15:42:07 МСК • T-Taxi Monitoring v2.4.1
        </span>
      </div>
    </div>
  );
}