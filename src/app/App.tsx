import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { MoscowMap } from './components/MoscowMap';
import { IncidentPanel } from './components/IncidentPanel';
import { VehicleTable } from './components/VehicleTable';
import { VehicleInspectionSidebar } from './components/VehicleInspectionSidebar';
import { vehicles, incidents } from './data/vehicles';

const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  body {
    font-family: 'Tinkoff Sans', 'Inter', -apple-system, BlinkMacSystemFont,
      'Segoe UI', 'Helvetica Neue', sans-serif;
    background: #F6F7F9;
    color: #1A1D23;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #F1F5F9;
  }
  ::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94A3B8;
  }

  /* Button resets */
  button {
    font-family: inherit;
    outline: none;
  }
  button:focus-visible {
    outline: 2px solid #FFDD2D;
    outline-offset: 2px;
  }
`;

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>();

  const selectedVehicleObj =
    selectedVehicle != null
      ? vehicles.find((v) => v.id === selectedVehicle) ?? null
      : null;

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicle((prev) => (prev === id ? undefined : id));
  };

  return (
    <>
      <style>{globalStyles}</style>

      <div
        style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: '#F6F7F9',
        }}
      >
        {/* Left sidebar */}
        <Sidebar />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {/* Header */}
          <DashboardHeader />

          {/* Content body */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {/* Split view: Map (70%) + Incident Panel (30%) */}
            <div
              style={{
                display: 'flex',
                height: 430,
                flexShrink: 0,
                borderBottom: '1px solid #E2E8F0',
              }}
            >
              <MoscowMap
                vehicles={vehicles}
                selectedId={selectedVehicle}
                onSelectVehicle={(v) => handleSelectVehicle(v.id)}
              />
              <IncidentPanel
                incidents={incidents}
                onAction={(id) => {
                  handleSelectVehicle(id);
                }}
              />
            </div>

            {/* Data table */}
            <VehicleTable
              vehicles={vehicles}
              selectedId={selectedVehicle}
              onSelectVehicle={(id) => handleSelectVehicle(id)}
            />
          </div>
        </div>

        {/* Vehicle Inspection Sidebar (fixed overlay) */}
        <VehicleInspectionSidebar
          vehicle={selectedVehicleObj}
          onClose={() => setSelectedVehicle(undefined)}
        />
      </div>
    </>
  );
}