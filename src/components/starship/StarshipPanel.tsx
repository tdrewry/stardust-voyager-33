
import React, { useMemo, useState } from 'react';
import { generateStarship } from '../../utils/starshipGenerator';
import { ActionsPanel } from './ActionsPanel';
import { ShipLayoutDialog } from './ShipLayoutDialog';
import { StarshipStats } from './StarshipStats';
import { StarSystem, BlackHole } from '../../utils/galaxyGenerator';

interface StarshipPanelProps {
  seed: number;
  selectedSystem: StarSystem | null;
  currentSystemId: string | null;
  isExplored: boolean;
  canBeExplored: boolean;
  explorationStatus: {
    systemId: string;
    explorationsCompleted: number;
    maxExplorations: number;
  };
  onBeginExploration: () => void;
  onResetExploration: () => void;
  shipStats?: any;
  onOpenMarket?: () => void;
  hideActions?: boolean;
  canJumpToSelected?: boolean;
  onJumpToSystem?: (systemId: string) => void;
  onTriggerScan?: () => void;
  isScanning?: boolean;
  onUpdateShipName?: (newName: string) => void;
  onRepairHull?: (cost: number) => void;
  onRepairShields?: (cost: number) => void;
  onRepairCombatSystems?: (cost: number) => void;
  onBlackHoleJumpBoost?: (jumpData: { mode: 'local' | 'newGalaxy' | 'knownGalaxy'; seed?: number }) => void;
  allSystems?: StarSystem[];
  allBlackHoles?: BlackHole[];
}

export const StarshipPanel: React.FC<StarshipPanelProps> = ({ 
  seed,
  selectedSystem,
  currentSystemId,
  isExplored,
  canBeExplored,
  explorationStatus,
  onBeginExploration,
  onResetExploration,
  shipStats,
  onOpenMarket,
  hideActions = false,
  canJumpToSelected = false,
  onJumpToSystem,
  onTriggerScan,
  isScanning = false,
  onUpdateShipName,
  onRepairHull,
  onRepairShields,
  onRepairCombatSystems,
  onBlackHoleJumpBoost,
  allSystems,
  allBlackHoles
}) => {
  const starship = useMemo(() => generateStarship(seed), [seed]);
  const [isShipLayoutOpen, setIsShipLayoutOpen] = useState(false);

  console.log('StarshipPanel Debug - Black Holes:', {
    allBlackHolesLength: allBlackHoles?.length || 0,
    allBlackHoleIds: allBlackHoles?.map(bh => bh.id) || [],
    allSystemsLength: allSystems?.length || 0,
    currentSystemId,
    shipStats: !!shipStats
  });

  console.log('StarshipPanel: onRepairHull prop received:', !!onRepairHull);
  console.log('StarshipPanel: onRepairShields prop received:', !!onRepairShields);
  console.log('StarshipPanel: onRepairCombatSystems prop received:', !!onRepairCombatSystems);
  console.log('StarshipPanel: onOpenMarket prop received:', !!onOpenMarket);

  // Merge ship stats with ship name and class, prioritizing saved name over generated name
  const currentStats = shipStats ? {
    ...shipStats,
    // Use saved name if it exists, otherwise fall back to generated name
    name: shipStats.name || starship.name,
    class: starship.class
  } : {
    ...starship.stats,
    name: starship.name,
    class: starship.class
  };

  const needsRepair = currentStats.shields < currentStats.maxShields || currentStats.hull < currentStats.maxHull;
  const needsCombatRepair = currentStats.combatPower < currentStats.maxCombatPower;

  return (
    <>
      <div className={`h-full bg-gray-900 border-t border-gray-700 ${hideActions ? '' : 'flex'}`}>
        <div className={hideActions ? 'w-full h-auto p-4' : 'flex-1 border-r border-gray-700 p-4'}>
          <StarshipStats 
            stats={currentStats} 
            onNameChange={onUpdateShipName}
            onRepairCombatSystems={onRepairCombatSystems}
            hideActions={hideActions}
            onOpenShipLayout={hideActions ? undefined : () => setIsShipLayoutOpen(true)}
          />
        </div>

        {!hideActions && (
          <div className="w-80 p-4 flex">
            <ActionsPanel
              selectedSystem={selectedSystem}
              currentSystemId={currentSystemId}
              isExplored={isExplored}
              canBeExplored={canBeExplored}
              explorationStatus={explorationStatus}
              onBeginExploration={onBeginExploration}
              onResetExploration={onResetExploration}
              onOpenShipLayout={() => setIsShipLayoutOpen(true)}
              needsRepair={needsRepair}
              needsCombatRepair={needsCombatRepair}
              onOpenMarket={onOpenMarket}
              canJumpToSelected={canJumpToSelected}
              onJumpToSystem={onJumpToSystem}
              onTriggerScan={onTriggerScan}
              isScanning={isScanning}
              onBlackHoleJumpBoost={onBlackHoleJumpBoost}
              allSystems={allSystems}
              allBlackHoles={allBlackHoles}
              shipStats={shipStats || currentStats}
            />
          </div>
        )}
      </div>

      <ShipLayoutDialog
        isOpen={isShipLayoutOpen}
        onClose={() => setIsShipLayoutOpen(false)}
        starship={starship}
      />
    </>
  );
};
