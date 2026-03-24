/**
 * @file PackingForm.tsx
 * @description Form component allowing users to manually add, generate, and remove custom-sized boxes to pack.
 */

import React, { useState } from 'react';
import type { Box, PackRequest } from '../types';

interface PackingFormProps {
    onSubmit: (payload: PackRequest) => void;
    onClear: () => void;
    isLoading: boolean;
}

const inputStyle = { padding: '8px', border: '1px solid #444', borderRadius: '6px', width: '100%', textAlign: 'center' as const, backgroundColor: '#222', color: 'white', boxSizing: 'border-box' as const };
const labelStyle = { display: 'flex', flexDirection: 'column' as const, fontSize: '12px', color: '#aaa', gap: '4px', fontWeight: 600, flex: 1 };
const buttonStyle = { padding: '10px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'opacity 0.2s', width: '100%' };

/**
 * Renders a form to construct the payload for the 3D bin packing service.
 * Container size is permanently fixed to 10x10x10 per requirements.
 * * @param {PackingFormProps} props - The component properties containing handlers and loading state.
 * @returns {JSX.Element} The rendered form interface.
 */
export const PackingForm: React.FC<PackingFormProps> = ({ onSubmit, onClear, isLoading }) => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [currentBox, setCurrentBox] = useState({ width: 5, depth: 5, height: 5 });
    const [randomCount, setRandomCount] = useState<number>(5);

    const totalVolume = boxes.reduce((sum, b) => sum + (b.width * b.depth * b.height), 0);
    const containerVolume = 1000;
    const volumePercentage = ((totalVolume / containerVolume) * 100).toFixed(1);
    const isOverVolume = totalVolume > containerVolume;

    /**
     * Appends a new box object with the user-defined dimensions to the current list of boxes.
     * * @returns {void}
     */
    const handleAddBox = (): void => {
        const newBox: Box = {
            id: `box-${Date.now()}`,
            width: currentBox.width,
            depth: currentBox.depth,
            height: currentBox.height,
        };
        setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    };

    /**
     * Removes a specific box from the list based on its unique identifier.
     * * @param {string} idToRemove - The ID of the box to be removed.
     * @returns {void}
     */
    const handleRemoveBox = (idToRemove: string): void => {
        setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== idToRemove));
    };

    /**
     * Generates a list of boxes using a recursive splitting algorithm on a 10x10x10 space.
     * * @returns {void}
     */
    const handleGenerateRandomBoxes = (): void => {
        const internalBoxes = [{ w: 10, d: 10, h: 10 }];

        while (internalBoxes.length < Math.max(1, randomCount)) {
            const splittableIndices = internalBoxes
                .map((b, index) => (b.w > 1 || b.d > 1 || b.h > 1 ? index : -1))
                .filter((index) => index !== -1);

            if (splittableIndices.length === 0) break;

            const targetIndex = splittableIndices[Math.floor(Math.random() * splittableIndices.length)];
            const boxToSplit = internalBoxes[targetIndex];

            internalBoxes.splice(targetIndex, 1);

            const validAxes: ('w' | 'd' | 'h')[] = [];
            if (boxToSplit.w > 1) validAxes.push('w');
            if (boxToSplit.d > 1) validAxes.push('d');
            if (boxToSplit.h > 1) validAxes.push('h');

            const splitAxis = validAxes[Math.floor(Math.random() * validAxes.length)];
            const axisLength = boxToSplit[splitAxis];
            const splitPoint = Math.floor(Math.random() * (axisLength - 1)) + 1;

            const box1 = { ...boxToSplit, [splitAxis]: splitPoint };
            const box2 = { ...boxToSplit, [splitAxis]: axisLength - splitPoint };

            internalBoxes.push(box1, box2);
        }

        const generatedBoxes: Box[] = internalBoxes.map((b, i) => ({
            id: `rand-box-${Date.now()}-${i}`,
            width: b.w,
            depth: b.d,
            height: b.h,
        }));

        setBoxes(generatedBoxes);
    };

    /**
     * Clears all local form state and triggers the parent clear handler.
     * * @returns {void}
     */
    const handleClearAll = (): void => {
        setBoxes([]);
        onClear();
    };

    /**
     * Prevents default form submission and triggers the provided submission handler.
     * * @param {React.FormEvent} event - The form submission event.
     * @returns {void}
     */
    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        onSubmit({
            container: { width: 10, depth: 10, height: 10 },
            boxes
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* MANUAL ENTRY SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Manual Entry</h3>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <label style={labelStyle}>Width <input type="number" style={inputStyle} value={currentBox.width} onChange={(e) => setCurrentBox({ ...currentBox, width: Number(e.target.value) })} min={1} /></label>
                    <label style={labelStyle}>Depth <input type="number" style={inputStyle} value={currentBox.depth} onChange={(e) => setCurrentBox({ ...currentBox, depth: Number(e.target.value) })} min={1} /></label>
                    <label style={labelStyle}>Height <input type="number" style={inputStyle} value={currentBox.height} onChange={(e) => setCurrentBox({ ...currentBox, height: Number(e.target.value) })} min={1} /></label>
                </div>
                <button type="button" onClick={handleAddBox} disabled={isLoading} style={{ ...buttonStyle, backgroundColor: '#333', color: '#fff' }}>
                    Add Box
                </button>
            </div>

            {/* RANDOM GENERATION SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Auto-Generate</h3>
                <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'flex-end' }}>
                    <label style={{ ...labelStyle, flex: 0.5 }}>Boxes
                        <input
                            type="number"
                            style={{ ...inputStyle, height: '38px' }}
                            value={randomCount}
                            onChange={(e) => setRandomCount(Number(e.target.value))}
                            min={1}
                            max={100}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={handleGenerateRandomBoxes}
                        disabled={isLoading}
                        style={{ ...buttonStyle, backgroundColor: '#2a2a2a', color: '#fff', flex: 1, border: '1px solid #444', height: '38px', padding: 0 }}
                    >
                        Generate
                    </button>
                </div>
            </div>

            {/* VISUAL SEPARATOR */}
            <div style={{ height: '1px', backgroundColor: '#333', width: '100%', margin: '4px 0' }} />

            {/* LIST OF BOXES & VOLUME TRACKER */}
            <div style={{ backgroundColor: '#1a1a1a', padding: '12px', borderRadius: '6px', minHeight: '80px', border: '1px solid #333' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ddd' }}>Boxes to Pack ({boxes.length})</p>
                    <span style={{ fontSize: '12px', color: isOverVolume ? '#ff6b6b' : (totalVolume === 1000 ? '#4ade80' : '#aaa'), fontWeight: 600 }}>
                        Vol: {totalVolume} / {containerVolume} ({volumePercentage}%)
                    </span>
                </div>

                <div style={{ width: '100%', backgroundColor: '#333', height: '6px', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                    <div
                        style={{
                            width: `${Math.min(100, Number(volumePercentage))}%`,
                            height: '100%',
                            backgroundColor: isOverVolume ? '#ff6b6b' : (totalVolume === 1000 ? '#4ade80' : '#3b82f6'),
                            transition: 'width 0.3s ease, background-color 0.3s ease'
                        }}
                    />
                </div>

                {boxes.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>No boxes added yet.</p>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', fontSize: '13px', color: '#aaa', maxHeight: '150px', overflowY: 'auto' }}>
                        {boxes.map((b) => (
                            <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderBottom: '1px solid #222' }}>
                                <span>
                                    {b.width}x{b.depth}x{b.height} <span style={{ color: '#555' }}>(vol: {b.width * b.depth * b.height})</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveBox(b.id)}
                                    disabled={isLoading}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        lineHeight: '1',
                                        padding: '0 4px',
                                        opacity: 0.8
                                    }}
                                    title="Remove box"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button type="submit" disabled={isLoading || boxes.length === 0} style={{ ...buttonStyle, flex: 1, backgroundColor: '#2563eb', color: 'white', opacity: (isLoading || boxes.length === 0) ? 0.5 : 1 }}>
                    {isLoading ? 'Calculating...' : 'Pack Boxes'}
                </button>
                <button type="button" onClick={handleClearAll} disabled={isLoading} style={{ ...buttonStyle, flex: 1, backgroundColor: '#4a0000', color: '#ff6b6b' }}>
                    Clear
                </button>
            </div>

        </form>
    );
};