/**
 * @file PackingVisualizer.tsx
 * @description 3D visualization component that renders the container and the packed boxes using React Three Fiber.
 */

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import type { Container, PackResponse } from '../types';

interface PackingVisualizerProps {
  data: PackResponse;
  container: Container;
}

/**
 * Generates a deterministic hex color based on a given string identifier.
 * * @param {string} id - The unique identifier to hash into a color.
 * @returns {string} The generated hex color string.
 */
const generateColorFromId = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 16777215) % 16777215)).toString(16);
  return `#${color.padStart(6, '0')}`;
};

/**
 * Renders an interactive 3D scene containing the bounding container and the calculated packed boxes.
 * * @param {PackingVisualizerProps} props - The properties including the packing result data and container dimensions.
 * @returns {JSX.Element} The rendered 3D canvas.
 */
export const PackingVisualizer: React.FC<PackingVisualizerProps> = ({ data, container }) => {
  const containerCenterX = container.width / 2;
  const containerCenterY = container.height / 2;
  const containerCenterZ = container.depth / 2;

  const boxesToRender = useMemo(() => {
    return data.packed_boxes.map((box) => {
      const [dimX, dimY, dimZ] = box.rotated_dimensions;
      const posX = box.position.x + dimX / 2;
      const posY = box.position.z + dimZ / 2;
      const posZ = box.position.y + dimY / 2;

      return {
        id: box.box_id,
        position: [posX, posY, posZ] as [number, number, number],
        dimensions: [dimX, dimZ, dimY] as [number, number, number],
        color: generateColorFromId(box.box_id),
      };
    });
  }, [data]);

  return (
    <div style={{ position: 'relative', height: '600px', width: '100%', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#050505' }}>
      <Canvas camera={{ position: [container.width * 1.5, container.height * 1.5, container.depth * 1.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        
        {/* Floor Grid: Cores mais escuras para se misturarem melhor com o fundo preto */}
        <gridHelper args={[100, 100, '#444444', '#222222']} position={[containerCenterX, 0, containerCenterZ]} />

        {/* Bounding Container: Linhas claras para sobressaírem no escuro */}
        <mesh position={[containerCenterX, containerCenterY, containerCenterZ]}>
          <boxGeometry args={[container.width, container.height, container.depth]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
          <Edges color="#888888" />
        </mesh>

        {/* Solid Packed Boxes */}
        {boxesToRender.map((box) => (
          <mesh key={box.id} position={box.position}>
            <boxGeometry args={box.dimensions} />
            <meshStandardMaterial color={box.color} roughness={0.3} />
            {/* Arestas das caixas mantêm-se pretas/escuras para contraste com as cores vivas */}
            <Edges color="#000000" scale={1.001} />
          </mesh>
        ))}

        <OrbitControls target={[containerCenterX, containerCenterY, containerCenterZ]} makeDefault />
      </Canvas>
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '12px', color: '#666', pointerEvents: 'none' }}>
        Tip: Scroll to zoom, click and drag to rotate.
      </div>
    </div>
  );
};