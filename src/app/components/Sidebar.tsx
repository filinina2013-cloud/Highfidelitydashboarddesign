import { useState } from 'react';
import type { ElementType } from 'react';
import {
  Map,
  Car,
  AlertTriangle,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

type NavItem = {
  icon: ElementType;
  label: string;
  id: string;
  badge?: number;
};

const navItems: NavItem[] = [
  { icon: Map, label: 'Карта', id: 'map' },
  { icon: Car, label: 'Флот', id: 'fleet' },
  { icon: AlertTriangle, label: 'Инциденты', id: 'incidents', badge: 5 },
  { icon: BarChart3, label: 'Аналитика', id: 'analytics' },
];

export function Sidebar() {
  const [activeId, setActiveId] = useState('map');

  return (
    <aside
      style={{
        width: 72,
        background: '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0 12px',
        borderRight: '1px solid #1F2937',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 42,
          height: 42,
          background: '#FFDD2D',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          flexShrink: 0,
          boxShadow: '0 0 0 4px rgba(255,221,45,0.15)',
        }}
      >
        <Zap size={22} color="#111827" strokeWidth={2.5} />
      </div>
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: '#FFDD2D',
          letterSpacing: 1.5,
          marginBottom: 28,
          textTransform: 'uppercase',
        }}
      >
        T-TAXI
      </span>

      {/* Nav items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          width: '100%',
          padding: '0 8px',
        }}
      >
        {navItems.map(({ icon: Icon, label, id, badge }) => (
          <button
            key={id}
            onClick={() => setActiveId(id)}
            title={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 54,
              borderRadius: 12,
              background:
                activeId === id
                  ? 'rgba(255, 221, 45, 0.14)'
                  : 'transparent',
              border:
                activeId === id
                  ? '1px solid rgba(255, 221, 45, 0.25)'
                  : '1px solid transparent',
              cursor: 'pointer',
              color: activeId === id ? '#FFDD2D' : '#4B5563',
              gap: 3,
              transition: 'all 0.18s',
              position: 'relative',
            }}
          >
            <Icon size={19} />
            <span style={{ fontSize: 9, fontWeight: 500 }}>{label}</span>
            {badge != null && (
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: '100%',
          padding: '0 8px 4px',
          alignItems: 'center',
        }}
      >
        <button
          title="Настройки"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            color: '#4B5563',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.18s',
          }}
        >
          <Settings size={18} />
        </button>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFDD2D 0%, #FFB800 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid rgba(255,221,45,0.3)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>
            АД
          </span>
        </div>
      </div>
    </aside>
  );
}