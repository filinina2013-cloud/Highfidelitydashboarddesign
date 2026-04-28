import { useState } from 'react';
import { ChevronRight, Bell, RefreshCw, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export function DashboardHeader() {
  const [city, setCity] = useState<'moscow' | 'spb'>('moscow');

  return (
    <header
      style={{
        height: 60,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        flexShrink: 0,
      }}
    >
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Radio size={14} color="#FFDD2D" strokeWidth={2.5} />
        <span style={{ fontSize: 13, color: '#9CA3AF' }}>T-Taxi</span>
        <ChevronRight size={13} color="#CBD5E1" />
        <span style={{ fontSize: 13, color: '#9CA3AF' }}>Москва</span>
        <ChevronRight size={13} color="#CBD5E1" />
        <span
          style={{ fontSize: 13, fontWeight: 600, color: '#1A1D23' }}
        >
          Мониторинг флота
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 24,
          background: '#E2E8F0',
          marginLeft: 4,
        }}
      />

      {/* City toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#F6F7F9',
          borderRadius: 10,
          padding: 3,
          border: '1px solid #E2E8F0',
          gap: 2,
        }}
      >
        {(
          [
            { key: 'moscow', label: 'Москва' },
            { key: 'spb', label: 'СПб' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCity(key)}
            style={{
              padding: '4px 14px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: city === key ? '#FFDD2D' : 'transparent',
              color: city === key ? '#111827' : '#6B7280',
              transition: 'all 0.15s',
              boxShadow:
                city === key ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right side stats */}
      <div
        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        {/* Live Fleet */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: '#F0FDF4',
            borderRadius: 10,
            border: '1px solid #BBF7D0',
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#22C55E',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: '#15803D', fontWeight: 500 }}>
            Активный флот:
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>
            1 240
          </span>
        </div>

        {/* Critical Errors */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: '#FEF2F2',
            borderRadius: 10,
            border: '1px solid #FECACA',
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#EF4444',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 500 }}>
            Критич. ошибки:
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#991B1B',
            }}
          >
            5
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <button
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: '#F6F7F9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <RefreshCw size={15} />
          </button>
          <button
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: '#F6F7F9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
              position: 'relative',
            }}
          >
            <Bell size={15} />
            <span
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#EF4444',
                border: '1.5px solid #F6F7F9',
              }}
            />
          </button>
        </div>

        {/* Timestamp */}
        <div
          style={{
            padding: '4px 10px',
            background: '#F6F7F9',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            fontSize: 11,
            color: '#9CA3AF',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          15:42:07 МСК
        </div>
      </div>
    </header>
  );
}
