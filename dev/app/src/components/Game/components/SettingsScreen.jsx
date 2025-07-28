import React, { useState, useEffect } from 'react';
import { WEAPONS, ENEMIES } from '../gameData.js';
import './SettingsScreen.css';

const SettingsScreen = ({ gameState, onChangeScreen, onUpdateGameValues, onAddWeapon, onRemoveWeapon }) => {
  const [activeTab, setActiveTab] = useState('weapons');
  const [weaponValues, setWeaponValues] = useState({});
  const [enemyValues, setEnemyValues] = useState({});
  const [playerValues, setPlayerValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    const initializeValues = () => {
      // 武器データの初期化
      const initialWeaponValues = {};
      Object.values(WEAPONS).forEach(weapon => {
        initialWeaponValues[weapon.id] = {
          baseAttack: weapon.baseAttack,
          critRate: weapon.critRate
        };
      });

      // 敵データの初期化
      const initialEnemyValues = {};
      Object.values(ENEMIES).forEach(enemy => {
        initialEnemyValues[enemy.id] = {
          maxHp: enemy.maxHp,
          attack: enemy.attack,
          defense: enemy.defense,
          exp: enemy.exp
        };
      });

      // プレイヤーデータの初期化
      const initialPlayerValues = {
        level: gameState.player.level,
        exp: gameState.player.exp,
        stamina: gameState.player.stamina,
        maxStamina: gameState.player.maxStamina
      };

      setWeaponValues(initialWeaponValues);
      setEnemyValues(initialEnemyValues);
      setPlayerValues(initialPlayerValues);
      setIsLoading(false);
    };

    initializeValues();
  }, [gameState.player]);

  // 武器データの更新
  const handleWeaponChange = (weaponId, field, value) => {
    const numValue = parseFloat(value) || 0;
    setWeaponValues(prev => ({
      ...prev,
      [weaponId]: {
        ...prev[weaponId],
        [field]: numValue
      }
    }));

    // 即座にゲームに反映
    onUpdateGameValues({
      weapons: {
        [weaponId]: {
          [field]: numValue
        }
      }
    });

    setUpdateStatus('武器データを更新しました');
    setTimeout(() => setUpdateStatus(''), 2000);
  };

  // 敵データの更新
  const handleEnemyChange = (enemyId, field, value) => {
    const numValue = parseFloat(value) || 0;
    setEnemyValues(prev => ({
      ...prev,
      [enemyId]: {
        ...prev[enemyId],
        [field]: numValue
      }
    }));

    // 即座にゲームに反映
    onUpdateGameValues({
      enemies: {
        [enemyId]: {
          [field]: numValue
        }
      }
    });

    setUpdateStatus('敵データを更新しました');
    setTimeout(() => setUpdateStatus(''), 2000);
  };

  // プレイヤーデータの更新
  const handlePlayerChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setPlayerValues(prev => ({
      ...prev,
      [field]: numValue
    }));

    // 即座にゲームに反映
    onUpdateGameValues({
      player: {
        [field]: numValue
      }
    });

    setUpdateStatus('プレイヤーデータを更新しました');
    setTimeout(() => setUpdateStatus(''), 2000);
  };

  // 武器の入手状況変更
  const handleWeaponInventoryToggle = (weaponId) => {
    const hasWeapon = gameState.player.inventory.weapons.includes(weaponId);
    
    if (hasWeapon) {
      onRemoveWeapon(weaponId);
      setUpdateStatus('武器を削除しました');
    } else {
      onAddWeapon(weaponId);
      setUpdateStatus('武器を追加しました');
    }
    
    setTimeout(() => setUpdateStatus(''), 2000);
  };


  if (isLoading) {
    return (
      <div className="settings-screen">
        <div className="loading-container">
          <div className="loading-text">データを読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button onClick={() => onChangeScreen('main')} className="back-btn">
          ← メインに戻る
        </button>
        <h2 className="settings-title">設定・数値調整</h2>
      </div>

      <div className="settings-content">
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('weapons')}
            className={`tab-btn ${activeTab === 'weapons' ? 'active' : ''}`}
          >
            武器調整
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          >
            武器管理
          </button>
          <button
            onClick={() => setActiveTab('enemies')}
            className={`tab-btn ${activeTab === 'enemies' ? 'active' : ''}`}
          >
            敵調整
          </button>
          <button
            onClick={() => setActiveTab('player')}
            className={`tab-btn ${activeTab === 'player' ? 'active' : ''}`}
          >
            プレイヤー
          </button>
        </div>

        {activeTab === 'weapons' && (
          <div className="values-section">
            <h3>武器データ調整</h3>
            <div className="values-grid">
              {Object.values(WEAPONS).map(weapon => (
                <div key={weapon.id} className="value-card">
                  <div className="value-header">
                    <img src={weapon.image} alt={weapon.name} className="item-icon" />
                    <div className="item-info">
                      <h4>{weapon.name}</h4>
                      <span className="item-meta">{weapon.attribute} - {weapon.rarity}</span>
                    </div>
                  </div>
                  <div className="value-controls">
                    <div className="control-row">
                      <label>攻撃力:</label>
                      <input
                        type="number"
                        value={weaponValues[weapon.id]?.baseAttack || weapon.baseAttack}
                        onChange={(e) => handleWeaponChange(weapon.id, 'baseAttack', e.target.value)}
                        className="value-input"
                        step="1"
                      />
                    </div>
                    <div className="control-row">
                      <label>クリティカル率:</label>
                      <input
                        type="number"
                        value={weaponValues[weapon.id]?.critRate || weapon.critRate}
                        onChange={(e) => handleWeaponChange(weapon.id, 'critRate', e.target.value)}
                        className="value-input"
                        step="0.01"
                        min="0"
                        max="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="values-section">
            <h3>武器入手状況管理</h3>
            <div className="inventory-info">
              <p>現在の武器数: {gameState.player.inventory.weapons.length}/{Object.keys(WEAPONS).length}</p>
            </div>
            <div className="values-grid">
              {Object.values(WEAPONS).map(weapon => {
                const hasWeapon = gameState.player.inventory.weapons.includes(weapon.id);
                return (
                  <div key={weapon.id} className={`value-card ${hasWeapon ? 'owned' : 'not-owned'}`}>
                    <div className="value-header">
                      <img src={weapon.image} alt={weapon.name} className="item-icon" />
                      <div className="item-info">
                        <h4>{weapon.name}</h4>
                        <span className="item-meta">{weapon.attribute} - {weapon.rarity}</span>
                      </div>
                    </div>
                    <div className="inventory-controls">
                      <div className="ownership-status">
                        <span className={`status-indicator ${hasWeapon ? 'owned' : 'not-owned'}`}>
                          {hasWeapon ? '所持中' : '未所持'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleWeaponInventoryToggle(weapon.id)}
                        className={`toggle-btn ${hasWeapon ? 'remove' : 'add'}`}
                      >
                        {hasWeapon ? '削除' : '追加'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'enemies' && (
          <div className="values-section">
            <h3>敵データ調整</h3>
            <div className="values-grid">
              {Object.values(ENEMIES).map(enemy => (
                <div key={enemy.id} className="value-card">
                  <div className="value-header">
                    <img src={enemy.image} alt={enemy.name} className="item-icon" />
                    <div className="item-info">
                      <h4>{enemy.name}</h4>
                      <span className="item-meta">{enemy.attribute} {enemy.isBoss ? '(ボス)' : ''}</span>
                    </div>
                  </div>
                  <div className="value-controls">
                    <div className="control-row">
                      <label>HP:</label>
                      <input
                        type="number"
                        value={enemyValues[enemy.id]?.maxHp || enemy.maxHp}
                        onChange={(e) => handleEnemyChange(enemy.id, 'maxHp', e.target.value)}
                        className="value-input"
                        step="1"
                      />
                    </div>
                    <div className="control-row">
                      <label>攻撃力:</label>
                      <input
                        type="number"
                        value={enemyValues[enemy.id]?.attack || enemy.attack}
                        onChange={(e) => handleEnemyChange(enemy.id, 'attack', e.target.value)}
                        className="value-input"
                        step="1"
                      />
                    </div>
                    <div className="control-row">
                      <label>防御力:</label>
                      <input
                        type="number"
                        value={enemyValues[enemy.id]?.defense || enemy.defense}
                        onChange={(e) => handleEnemyChange(enemy.id, 'defense', e.target.value)}
                        className="value-input"
                        step="1"
                      />
                    </div>
                    <div className="control-row">
                      <label>経験値:</label>
                      <input
                        type="number"
                        value={enemyValues[enemy.id]?.exp || enemy.exp}
                        onChange={(e) => handleEnemyChange(enemy.id, 'exp', e.target.value)}
                        className="value-input"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'player' && (
          <div className="values-section">
            <h3>プレイヤーデータ調整</h3>
            <div className="player-controls">
              <div className="value-card">
                <div className="value-header">
                  <img src="/image/player/Player_Main.png" alt="プレイヤー" className="item-icon" />
                  <div className="item-info">
                    <h4>プレイヤー</h4>
                    <span className="item-meta">基本ステータス</span>
                  </div>
                </div>
                <div className="value-controls">
                  <div className="control-row">
                    <label>レベル:</label>
                    <input
                      type="number"
                      value={playerValues.level || gameState.player.level}
                      onChange={(e) => handlePlayerChange('level', e.target.value)}
                      className="value-input"
                      step="1"
                      min="1"
                      max="50"
                    />
                  </div>
                  <div className="control-row">
                    <label>経験値:</label>
                    <input
                      type="number"
                      value={playerValues.exp || gameState.player.exp}
                      onChange={(e) => handlePlayerChange('exp', e.target.value)}
                      className="value-input"
                      step="1"
                      min="0"
                    />
                  </div>
                  <div className="control-row">
                    <label>現在スタミナ:</label>
                    <input
                      type="number"
                      value={playerValues.stamina || gameState.player.stamina}
                      onChange={(e) => handlePlayerChange('stamina', e.target.value)}
                      className="value-input"
                      step="1"
                      min="0"
                    />
                  </div>
                  <div className="control-row">
                    <label>最大スタミナ:</label>
                    <input
                      type="number"
                      value={playerValues.maxStamina || gameState.player.maxStamina}
                      onChange={(e) => handlePlayerChange('maxStamina', e.target.value)}
                      className="value-input"
                      step="1"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {updateStatus && (
          <div className="update-status success">
            {updateStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;