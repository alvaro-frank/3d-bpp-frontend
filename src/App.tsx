/**
 * @file App.tsx
 * @description Main application component demonstrating state management and 3D visualization integration.
 */

import React, { useState } from 'react';
import { usePacking } from './hooks/usePacking';
import { PackingForm } from './components/PackingForm';
import { PackingVisualizer } from './components/PackingVisualizer';
import type { PackRequest, Container } from './types';

const FIXED_CONTAINER: Container = { width: 10, depth: 10, height: 10 };
const CONTAINER_VOLUME = FIXED_CONTAINER.width * FIXED_CONTAINER.depth * FIXED_CONTAINER.height;
const cardStyle = { backgroundColor: '#111111', padding: '24px', borderRadius: '12px', border: '1px solid #222' };

/**
 * The root component of the Single Page Application.
 * * @returns {JSX.Element} The rendered application layout.
 */
const App: React.FC = () => {
  const { data, isLoading, error, executePacking, resetPacking } = usePacking();
  
  const [totalRequestedBoxes, setTotalRequestedBoxes] = useState<number>(0);

  /**
   * Handles the form submission by invoking the custom hook's execute function.
   * * @param {PackRequest} payload - The request data collected from the form.
   * @returns {void}
   */
  const handleFormSubmit = (payload: PackRequest): void => {
    setTotalRequestedBoxes(payload.boxes.length);
    executePacking(payload);
  };

  /**
   * Clears the fetched data and the local metric states.
   * * @returns {void}
   */
  const handleClear = (): void => {
    setTotalRequestedBoxes(0);
    resetPacking();
  };

  const packedVolume = data ? data.packed_boxes.reduce((sum, box) => {
    const [dimX, dimY, dimZ] = box.rotated_dimensions;
    return sum + (dimX * dimY * dimZ);
  }, 0) : 0;
  
  const packedVolumePercentage = data ? ((packedVolume / CONTAINER_VOLUME) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '28px' }}>3D Bin Packing Optimizer</h1>
        </header>
        
        <section style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', alignItems: 'start' }}>
          
          <aside style={cardStyle}>
            <PackingForm onSubmit={handleFormSubmit} onClear={handleClear} isLoading={isLoading} />
            {error && (
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#3a0000', color: '#ff8888', borderRadius: '6px', fontSize: '14px', border: '1px solid #ff0000' }}>
                <strong>Error:</strong> {error.message}
              </div>
            )}
          </aside>

          <article style={{ ...cardStyle, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>3D Visualization</h2>
              
              {data && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Badge: Packed Boxes */}
                  <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', color: '#aaa', border: '1px solid #333' }}>
                    Items:{' '}
                    <strong style={{ color: data.packed_boxes.length === totalRequestedBoxes ? '#4ade80' : '#fb923c' }}>
                      {data.packed_boxes.length}
                    </strong> 
                    {' '}/ {totalRequestedBoxes}
                  </div>

                  {/* Badge: Filled Volume */}
                  <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', color: '#aaa', border: '1px solid #333' }}>
                    Used Volume:{' '}
                    <strong style={{ color: '#60a5fa' }}>
                      {packedVolume}
                    </strong> 
                    {' '}/ {CONTAINER_VOLUME} ({packedVolumePercentage}%)
                  </div>
                </div>
              )}
            </div>
            
            {data ? (
              <PackingVisualizer data={data} container={FIXED_CONTAINER} />
            ) : (
              <div style={{ height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '2px dashed #333' }}>
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>🧊</span>
                <p style={{ margin: 0, color: '#666', fontSize: '16px', fontWeight: 500 }}>Add boxes and run to view the result.</p>
              </div>
            )}
          </article>
          
        </section>
      </main>
    </div>
  );
};

export default App;