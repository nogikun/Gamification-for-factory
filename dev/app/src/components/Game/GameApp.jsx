import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGameState } from './hooks/useGameState.js';
import MainScreen from './components/MainScreen.jsx';
import InventoryScreen from './components/InventoryScreen.jsx';
import DungeonScreen from './components/DungeonScreen.jsx';
import BattleScreen from './components/BattleScreen.jsx';
import TrainingScreen from './components/TrainingScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import './GameApp.css';

function GameApp() {
  const history = useHistory();
  const {
    gameState,
    equipWeapon,
    unequipWeapon,
    enterDungeon,
    startBattle,
    endBattle,
    useStaminaPotion,
    consumeStamina,
    dealDamageToEnemy,
    takeDamage,
    changeScreen,
    addBattleLog,
    unlockRandomWeapon,
    addWeaponToInventory,
    removeWeaponFromInventory,
    updateGameValues
  } = useGameState();

  const navigateToTab1 = () => {
    history.push('/tab1');
  };

  const renderCurrentScreen = () => {
    switch (gameState.ui.currentScreen) {
      case 'main':
        return (
          <MainScreen
            gameState={gameState}
            onEnterDungeon={enterDungeon}
            onChangeScreen={changeScreen}
            onUseStaminaPotion={useStaminaPotion}
            onNavigateToTab1={navigateToTab1}
          />
        );
      
      case 'inventory':
        return (
          <InventoryScreen
            gameState={gameState}
            onEquipWeapon={equipWeapon}
            onUnequipWeapon={unequipWeapon}
            onChangeScreen={changeScreen}
          />
        );
      
      case 'dungeon':
        return (
          <DungeonScreen
            gameState={gameState}
            onStartBattle={startBattle}
            onChangeScreen={changeScreen}
          />
        );
      
      case 'battle':
        return (
          <BattleScreen
            gameState={gameState}
            onEndBattle={endBattle}
            onConsumeStamina={consumeStamina}
            onDealDamageToEnemy={dealDamageToEnemy}
            onTakeDamage={takeDamage}
            onAddBattleLog={addBattleLog}
            onUseStaminaPotion={useStaminaPotion}
          />
        );
      
      case 'training':
        return (
          <TrainingScreen
            gameState={gameState}
            onChangeScreen={changeScreen}
            onUnlockRandomWeapon={unlockRandomWeapon}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            gameState={gameState}
            onChangeScreen={changeScreen}
            onUpdateGameValues={updateGameValues}
            onAddWeapon={addWeaponToInventory}
            onRemoveWeapon={removeWeaponFromInventory}
          />
        );
      
      default:
        return (
          <MainScreen
            gameState={gameState}
            onEnterDungeon={enterDungeon}
            onChangeScreen={changeScreen}
            onUseStaminaPotion={useStaminaPotion}
            onNavigateToTab1={navigateToTab1}
          />
        );
    }
  };

  return (
    <div className="GameApp" style={{ height: '100vh', overflow: 'auto' }}>
      {renderCurrentScreen()}
    </div>
  );
}

export default GameApp;