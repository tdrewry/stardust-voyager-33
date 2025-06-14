
import React from 'react';
import { BlackHoleMesh } from './blackhole/BlackHoleMesh';
import { BlackHoleSelectionRing } from './blackhole/BlackHoleSelectionRing';

interface BlackHoleProps {
  id: string;
  position: [number, number, number];
  size?: number;
  isSelected?: boolean;
  onSelect?: (blackHole: { id: string; position: [number, number, number] }) => void;
}

export const BlackHole: React.FC<BlackHoleProps> = ({
  id,
  position,
  size = 150,
  isSelected = false,
  onSelect
}) => {
  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onSelect) {
      onSelect({ id, position });
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={position}>
      {/* Central black sphere - this is the only clickable element */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[size * 0.1, 16, 12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* First ring - vertical orientation (no click handlers) */}
      <BlackHoleMesh
        size={size}
        onClick={() => {}} // No-op function
        onPointerOver={() => {}}
        onPointerOut={() => {}}
        disableBillboard={false}
      />
      
      {/* Second ring - horizontal orientation (rotated 90 degrees around X-axis, no click handlers) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <BlackHoleMesh
          size={size}
          onClick={() => {}} // No-op function
          onPointerOver={() => {}}
          onPointerOut={() => {}}
          disableBillboard={true}
        />
      </group>
      
      <BlackHoleSelectionRing size={size} isSelected={isSelected} />
    </group>
  );
};
