import React from 'react';
import { WEAPONS, RARITY, WEIGHT_CLASS, ATTRIBUTE, calculateStaminaCost } from '../gameData.js';
import './InventoryScreen.css';

const InventoryScreen = ({ gameState, onEquipWeapon, onUnequipWeapon, onChangeScreen }) => {
  const { player } = gameState;

  const getWeaponById = (id) => {
    return WEAPONS[id];
  };

  const isWeaponEquipped = (weaponId) => {
    return player.equippedWeapons.includes(weaponId);
  };

  const getEquipSlotIndex = (weaponId) => {
    return player.equippedWeapons.indexOf(weaponId);
  };

  const handleEquipWeapon = (weaponId) => {
    // 空いているスロットを探す
    const emptySlotIndex = player.equippedWeapons.indexOf(null);
    if (emptySlotIndex !== -1) {
      onEquipWeapon(weaponId, emptySlotIndex);
    }
  };

  const handleUnequipWeapon = (slotIndex) => {
    onUnequipWeapon(slotIndex);
  };

  return (
    <div className="inventory-screen">
      <div className="inventory-header">
        <button onClick={() => onChangeScreen('main')} className="back-btn">
          ← メインに戻る
        </button>
        <h1>装備・アイテム</h1>
      </div>

      <div className="inventory-content">
        <div className="equipped-section">
          <h2>装備中の武器</h2>
          <div className="equipped-slots">
            {player.equippedWeapons.map((weaponId, index) => (
              <div key={index} className="equipment-slot">
                <div className="slot-header">スロット {index + 1}</div>
                {weaponId ? (
                  <div className="equipped-weapon">
                    <img 
                      src={WEAPONS[weaponId].image} 
                      alt={WEAPONS[weaponId].name}
                      className="weapon-image small"
                    />
                    <div className="weapon-info">
                      <div className="weapon-name" style={{ color: RARITY[WEAPONS[weaponId].rarity].color }}>
                        {WEAPONS[weaponId].name}
                      </div>
                      <div className="weapon-stats">
                        攻撃力: {WEAPONS[weaponId].baseAttack}<br/>
                        クリ率: {(WEAPONS[weaponId].critRate * 100).toFixed(1)}%<br/>
                        スタミナ: {calculateStaminaCost(WEAPONS[weaponId])}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUnequipWeapon(index)}
                      className="unequip-btn"
                    >
                      外す
                    </button>
                  </div>
                ) : (
                  <div className="empty-slot">
                    <span>未装備</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="weapons-section">
          <h2>所持武器</h2>
          <div className="weapons-grid">
            {player.inventory.weapons.map(weaponId => {
              const weapon = getWeaponById(weaponId);
              const equipped = isWeaponEquipped(weaponId);
              return (
                <div key={weaponId} className={`weapon-card ${equipped ? 'equipped' : ''}`}>
                  <img 
                    src={weapon.image} 
                    alt={weapon.name}
                    className="weapon-image"
                  />
                  <div className="weapon-details">
                    <div className="weapon-name" style={{ color: RARITY[weapon.rarity].color }}>
                      {weapon.name}
                    </div>
                    <div className="weapon-attributes">
                      <span className="attribute">{ATTRIBUTE[weapon.attribute].name}</span>
                      <span className="weight">{WEIGHT_CLASS[weapon.weightClass].name}</span>
                      <span className="rarity" style={{ color: RARITY[weapon.rarity].color }}>
                        {weapon.rarity}
                      </span>
                    </div>
                    <div className="weapon-stats">
                      <div>攻撃力: {weapon.baseAttack}</div>
                      <div>クリ率: {(weapon.critRate * 100).toFixed(1)}%</div>
                      <div>スタミナ消費: {calculateStaminaCost(weapon)}</div>
                      {weapon.effect && (
                        <div className="weapon-effect">効果: {weapon.effect}</div>
                      )}
                    </div>
                    {equipped ? (
                      <div className="equipped-indicator">
                        装備中 (スロット {getEquipSlotIndex(weaponId) + 1})
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEquipWeapon(weaponId)}
                        disabled={player.equippedWeapons.indexOf(null) === -1}
                        className="equip-btn"
                      >
                        装備
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="items-section">
          <h2>アイテム</h2>
          <div className="items-grid">
            <div className="item-card">
              <div className="item-name">スタミナ回復薬</div>
              <div className="item-count">所持数: {player.inventory.items.stamina_potion}</div>
              <div className="item-description">スタミナを全回復します</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryScreen; 