import React from 'react';
import { DUNGEONS, ENEMIES } from '../gameData.js';
import './DungeonScreen.css';

const DungeonScreen = ({ gameState, onStartBattle, onChangeScreen }) => {
  const { dungeon } = gameState;
  const currentDungeon = DUNGEONS[dungeon.currentDungeon];
  const currentEnemy = dungeon.enemies[dungeon.currentEnemyIndex];
  const allEnemiesDefeated = dungeon.enemies.every(enemy => enemy.currentHp <= 0);

  const getEnemyStatus = (enemy) => {
    if (enemy.currentHp <= 0) {
      return '撃破済み';
    }
    return `HP: ${enemy.currentHp} / ${enemy.maxHp}`;
  };

  const getEnemyStatusClass = (enemy) => {
    if (enemy.currentHp <= 0) {
      return 'defeated';
    }
    const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;
    if (hpPercent > 50) return 'healthy';
    if (hpPercent > 25) return 'damaged';
    return 'critical';
  };

  return (
    <div className="dungeon-screen">
      <div className="dungeon-header">
        <button onClick={() => onChangeScreen('main')} className="back-btn">
          ← メインに戻る
        </button>
        <h1>{currentDungeon.name}</h1>
      </div>

      <div className="dungeon-info">
        <div className="dungeon-details">
          <h2>ダンジョン情報</h2>
          <div className="info-row">
            <span>属性: {currentDungeon.attribute}</span>
            <span>推奨属性: {currentDungeon.recommendedAttribute}</span>
          </div>
          <div className="progress-info">
            進行度: {dungeon.currentEnemyIndex + 1} / {dungeon.enemies.length}
          </div>
        </div>
      </div>

      <div className="enemies-section">
        <h2>敵一覧</h2>
        <div className="enemies-list">
          {dungeon.enemies.map((enemy, index) => (
            <div 
              key={index} 
              className={`enemy-card ${index === dungeon.currentEnemyIndex ? 'current' : ''} ${getEnemyStatusClass(enemy)}`}
            >
              <div className="enemy-card-content">
                <div className="enemy-image-section">
                  {enemy.image ? (
                    <div 
                      className={`enemy-image ${enemy.imageClass} ${enemy.currentHp <= 0 ? 'defeated' : ''}`}
                      style={{ backgroundImage: `url(${enemy.image})` }}
                    ></div>
                  ) : (
                    <div className="enemy-placeholder">
                      <div className="enemy-icon">敵</div>
                    </div>
                  )}
                </div>
                <div className="enemy-info">
                  <h3>{enemy.name}</h3>
                  <div className="enemy-type">
                    {enemy.isBoss ? 'ボス' : '通常敵'}
                  </div>
                  <div className="enemy-stats">
                    <div>攻撃力: {enemy.attack}</div>
                    <div>防御力: {enemy.defense}</div>
                    <div>経験値: {enemy.exp}</div>
                  </div>
                  <div className={`enemy-status ${getEnemyStatusClass(enemy)}`}>
                    {getEnemyStatus(enemy)}
                  </div>
                </div>
              </div>
              
              {index === dungeon.currentEnemyIndex && enemy.currentHp > 0 && (
                <div className="current-enemy-actions">
                  <div className="current-label">← 現在の敵</div>
                  <button 
                    onClick={onStartBattle}
                    className="battle-btn"
                    disabled={dungeon.inBattle}
                  >
                    戦闘開始
                  </button>
                </div>
              )}
              
              {index < dungeon.currentEnemyIndex && (
                <div className="completed-label">撃破済み</div>
              )}
              
              {index > dungeon.currentEnemyIndex && (
                <div className="upcoming-label">未到達</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {allEnemiesDefeated && (
        <div className="completion-section">
          <div className="completion-message">
            <h2>ダンジョンクリア！</h2>
            <p>すべての敵を撃破しました！</p>
            <button 
              onClick={() => onChangeScreen('main')}
              className="return-btn"
            >
              メインに戻る
            </button>
          </div>
        </div>
      )}

      <div className="dungeon-tips">
        <h3>ヒント</h3>
        <ul>
          <li>推奨属性の武器を使うと2倍のダメージを与えられます</li>
          <li>敵のHPは戦闘から逃げても保持されます</li>
          <li>攻撃すると敵からの反撃でスタミナが減少します</li>
          <li>スタミナが足りない場合は戦闘ができません</li>
        </ul>
      </div>
    </div>
  );
};

export default DungeonScreen; 