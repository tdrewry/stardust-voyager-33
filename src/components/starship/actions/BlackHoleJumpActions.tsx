
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle } from 'lucide-react';
import { StarSystem, BlackHole } from '../../../utils/galaxyGenerator';
import { BlackHoleJumpDialog } from './BlackHoleJumpDialog';

interface BlackHoleJumpActionsProps {
  selectedSystem: StarSystem | null;
  currentSystemId: string | null;
  onBlackHoleJumpBoost: (jumpData: { mode: 'local' | 'newGalaxy' | 'knownGalaxy'; seed?: number }) => void;
  allSystems?: StarSystem[];
  allBlackHoles?: BlackHole[];
  shipStats?: any;
}

export const BlackHoleJumpActions: React.FC<BlackHoleJumpActionsProps> = ({
  selectedSystem,
  currentSystemId,
  onBlackHoleJumpBoost,
  allSystems = [],
  allBlackHoles = [],
  shipStats
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Find the current system where the player is located
  const currentSystem = currentSystemId ? 
    allSystems.find(s => s.id === currentSystemId) || 
    allBlackHoles.find(bh => bh.id === currentSystemId) : null;

  // Check if we can draw purple lines to black holes (tech level 8+ requirement)
  const canUseBlackHoleJumps = shipStats && shipStats.techLevel >= 8;
  
  // Check if there are any black holes within jump range and if galactic center is among them
  const blackHoleAnalysis = React.useMemo(() => {
    if (!currentSystem || !canUseBlackHoleJumps || !shipStats) {
      return { hasBlackHoleInRange: false, hasGalacticCenterInRange: false };
    }
    
    const galaxyWidth = 100000;
    const maxJumpDistance = (shipStats.techLevel / 10) * (galaxyWidth / 16);
    
    let hasBlackHoleInRange = false;
    let hasGalacticCenterInRange = false;
    
    allBlackHoles.forEach(blackHole => {
      if (blackHole.id === currentSystemId) return;
      
      const dx = currentSystem.position[0] - blackHole.position[0];
      const dy = currentSystem.position[1] - blackHole.position[1];
      const dz = currentSystem.position[2] - blackHole.position[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance <= maxJumpDistance) {
        hasBlackHoleInRange = true;
        
        // Check if this is the galactic center (should be at or very near 0,0,0)
        const centerDistance = Math.sqrt(
          blackHole.position[0] * blackHole.position[0] + 
          blackHole.position[1] * blackHole.position[1] + 
          blackHole.position[2] * blackHole.position[2]
        );
        
        if (centerDistance < 5000) { // Within 5000 units of galactic center
          hasGalacticCenterInRange = true;
        }
      }
    });
    
    return { hasBlackHoleInRange, hasGalacticCenterInRange };
  }, [currentSystem, currentSystemId, allBlackHoles, canUseBlackHoleJumps, shipStats]);

  console.log('BlackHoleJumpActions Enhanced Debug:', {
    currentSystemId,
    hasCurrentSystem: !!currentSystem,
    currentSystemPosition: currentSystem?.position,
    canUseBlackHoleJumps,
    hasBlackHoleInRange: blackHoleAnalysis.hasBlackHoleInRange,
    hasGalacticCenterInRange: blackHoleAnalysis.hasGalacticCenterInRange,
    techLevel: shipStats?.techLevel,
    blackHolesCount: allBlackHoles.length,
    blackHoleIds: allBlackHoles.map(bh => bh.id),
    blackHolePositions: allBlackHoles.map(bh => ({ id: bh.id, position: bh.position })),
    maxJumpDistance: shipStats ? (shipStats.techLevel / 10) * (100000 / 16) : 0,
    allSystemsCount: allSystems.length
  });

  // Only show if we're at a system that can reach black holes
  if (!blackHoleAnalysis.hasBlackHoleInRange) {
    return null;
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmJump = (jumpData: { mode: 'local' | 'newGalaxy' | 'knownGalaxy'; seed?: number }) => {
    onBlackHoleJumpBoost(jumpData);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-400 text-xs mb-3">
            <AlertTriangle className="h-3 w-3" />
            <span>Experimental technology - destination is random</span>
          </div>
          <Button
            onClick={handleOpenDialog}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <Zap className="h-4 w-4 mr-2" />
            Activate Jump Boost
          </Button>
        </div>
      </div>

      <BlackHoleJumpDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmJump}
        hasGalacticCenterInRange={blackHoleAnalysis.hasGalacticCenterInRange}
      />
    </>
  );
};
