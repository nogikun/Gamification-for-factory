import React, { useState, useRef } from 'react';
import { DUNGEONS, calculateRequiredExp, calculateTotalExpForLevel } from '../gameData.js';
import './MainScreen.css';

const MainScreen = ({ gameState, onEnterDungeon, onChangeScreen, onUseStaminaPotion }) => {
  const { player } = gameState;
  const nextLevelExp = calculateTotalExpForLevel(player.level + 1);
  const currentLevelExp = player.level > 1 ? calculateTotalExpForLevel(player.level) : 0;
  const expProgress = ((player.exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  
  const [selectedDungeon, setSelectedDungeon] = useState(Object.values(DUNGEONS)[0]);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);

  // プレイヤー画像の連続クリックハンドラー
  const handlePlayerClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // 既存のタイムアウトをクリア
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    // 5回連続クリックで設定画面へ
    if (newClickCount >= 5) {
      setClickCount(0);
      onChangeScreen('settings');
      return;
    }
    
    // 1秒間何もクリックされなかったらカウントリセット
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
  };

  return (
    <div className="main-screen">
      <div className="main-header">
        <img 
          src="/image/main/タイトル.png" 
          alt="まちこうばダンジョン"
          className="title-logo"
        />
      </div>
      
      <div className="main-content">
        {/* 左カラム: ダンジョン選択パネル */}
        <div className="left-column">
          <div className="dungeon-showcase">
            <div className="dungeon-preview">
              <div className="dungeon-illustration">
                <img 
                  src={selectedDungeon.image} 
                  alt={selectedDungeon.name}
                  className="dungeon-image"
                />
              </div>
              <div className="dungeon-info">
                <h2 className="dungeon-title">{selectedDungeon.name}</h2>
                <div className="dungeon-attributes">
                  <span className="attribute-badge dungeon-attr">
                    属性: {selectedDungeon.attribute}
                  </span>
                  <span className="attribute-badge recommend-attr">
                    推奨: {selectedDungeon.recommendedAttribute}
                  </span>
                </div>
                <div className="dungeon-description">
                  {selectedDungeon.id === 'welding' && '熱い溶接炉が燃え盛る工場。マグマの力を持つ敵たちが待ち受けている。'}
                  {selectedDungeon.id === 'cutting' && '金属を刃物で切り裂く工場。鋼鉄のように硬い敵たちが陣取っている。'}
                  {selectedDungeon.id === 'polishing' && '美しく研き上げられた製品が並ぶ工場。クリスタルのように美しい敵たちが棲んでいる。'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => onEnterDungeon(selectedDungeon.id)}
              disabled={player.stamina < 10}
              className="challenge-btn"
            >
              <span className="btn-icon"></span>
              <span className="btn-text">挑戦開始</span>
              <span className="btn-subtext"></span>
            </button>
          </div>
          
          <div className="dungeon-selector">
            <h3>ダンジョン選択</h3>
            <div className="dungeon-tabs">
              {Object.values(DUNGEONS).map(dungeon => (
                <button 
                  key={dungeon.id}
                  onClick={() => setSelectedDungeon(dungeon)}
                  className={`dungeon-tab ${selectedDungeon.id === dungeon.id ? 'active' : ''}`}
                >
                  {dungeon.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右カラム: プレイヤー情報 + メニュー */}
        <div className="right-column">
          <div className="player-status">
            <div className="player-info">
              <img 
                src="/image/player/Player_Main.png" 
                alt="プレイヤー"
                className={`player-avatar ${clickCount > 0 ? 'secret-click' : ''}`}
                onClick={handlePlayerClick}
                style={{ cursor: 'pointer' }}
              />
              <div className="status-details">
                <h3>レベル {player.level}</h3>
                <div className="hp-display">
                  <div className="stat-row">
                    <span>HP: {player.hp} / {player.maxHp}</span>
                    <div className="hp-bar">
                      <div 
                        className="hp-fill" 
                        style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="exp-section">
                  <div className="exp-bar">
                    <div className="exp-fill" style={{ width: `${expProgress}%` }}></div>
                    <span className="exp-text">{player.exp} / {nextLevelExp}</span>
                  </div>
                  {player.level < 50 && (
                    <div className="next-level">
                      次まで: {nextLevelExp - player.exp} EXP
                    </div>
                  )}
                </div>
                <div className="stamina-section">
                  <div className="stamina-row">
                    <span>スタミナ: {player.stamina} / {player.maxStamina}</span>
                    <button 
                      onClick={onUseStaminaPotion}
                      disabled={player.inventory.items.stamina_potion <= 0 || player.stamina >= player.maxStamina}
                      className="stamina-potion-btn"
                    >
                      回復 ({player.inventory.items.stamina_potion})
                    </button>
                  </div>
                  <div className="stamina-bar">
                    <div 
                      className="stamina-fill" 
                      style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-section">
            <h3>メニュー</h3>
            <div className="menu-buttons">
              <button 
                onClick={() => onChangeScreen('inventory')}
                className="menu-btn equipment-btn"
              >
                <span className="btn-icon"></span>
                <span className="btn-label">装備・アイテム</span>
              </button>
              <button 
                onClick={() => onChangeScreen('training')}
                className="menu-btn training-btn"
              >
                <span className="btn-icon">🎯</span>
                <span className="btn-label">トレーニング</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen; 
// Copyright (c) 2025 Kaito220009
// All rights reserved.
