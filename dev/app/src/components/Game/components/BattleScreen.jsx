import React, { useState } from 'react';
import { WEAPONS, calculateDamage, calculateStaminaCost, getAttributeMultiplier } from '../gameData.js';
import './BattleScreen.css';

const BattleScreen = ({ 
  gameState, 
  onEndBattle, 
  onConsumeStamina, 
  onDealDamageToEnemy, 
  onTakeDamage, 
  onAddBattleLog,
  onUseStaminaPotion 
}) => {
  const { player, dungeon, ui } = gameState;
  const currentEnemy = dungeon.enemies[dungeon.currentEnemyIndex];
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0);
  const [attackingWeapon, setAttackingWeapon] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isEnemyDefeated, setIsEnemyDefeated] = useState(false);
  const [showReturnButton, setShowReturnButton] = useState(false);
  const [enemyDamageEffect, setEnemyDamageEffect] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);

  // 装備武器を取得
  const getEquippedWeapons = () => {
    return player.equippedWeapons
      .filter(weaponId => weaponId !== null)
      .map(weaponId => WEAPONS[weaponId]);
  };

  const equippedWeapons = getEquippedWeapons();
  const selectedWeapon = equippedWeapons[selectedWeaponIndex];

  // 戦闘処理
  const handleAttack = async () => {
    if (!selectedWeapon || player.stamina <= 0 || isAttacking) return;

    const staminaCost = calculateStaminaCost(selectedWeapon);
    if (player.stamina < staminaCost) {
      onAddBattleLog({ message: 'スタミナが足りません！', type: 'error' });
      return;
    }

    // 武器攻撃アニメーション開始
    setAttackingWeapon(selectedWeapon);
    setIsAttacking(true);

    // クリティカル判定
    const isCritical = Math.random() < selectedWeapon.critRate;
    
    // ダメージ計算（非同期）
    const damage = await calculateDamage(selectedWeapon, player.level, currentEnemy.attribute, isCritical, currentEnemy.defense);
    const attributeMultiplier = await getAttributeMultiplier(selectedWeapon.attribute, currentEnemy.attribute);
    
    // 敵撃破チェック（ダメージ適用前に判定）
    const willDefeatEnemy = currentEnemy.currentHp - damage <= 0;
    
    // スタミナ消費
    onConsumeStamina(staminaCost);
    
    // 敵にダメージ
    onDealDamageToEnemy(damage);
    
    // ダメージエフェクト
    setEnemyDamageEffect(true);
    setTimeout(() => setEnemyDamageEffect(false), 500);
    
    // ログ追加（実際のダメージ値を表示）
    let attackLog = `${selectedWeapon.name}で攻撃！ ${Math.floor(damage)}ダメージ！`;
    let logType = 'attack';
    
    // 効果に基づいてログタイプとメッセージを調整
    if (isCritical && attributeMultiplier > 1) {
      attackLog += ' (クリティカル！属性有効！)';
      logType = 'critical';
    } else if (isCritical && attributeMultiplier < 1) {
      attackLog += ' (クリティカル！属性不利...)';
      logType = 'critical';
    } else if (isCritical) {
      attackLog += ' (クリティカル！)';
      logType = 'critical';
    } else if (attributeMultiplier > 1) {
      attackLog += ' (属性有効！)';
      logType = 'effective';
    } else if (attributeMultiplier < 1) {
      attackLog += ' (属性不利...)';
      logType = 'weak';
    }
    
    onAddBattleLog({ message: attackLog, type: logType });

    // 敵撃破処理
    if (willDefeatEnemy) {
      setIsEnemyDefeated(true);
      onAddBattleLog({ message: `${currentEnemy.name}を倒した！`, type: 'victory' });
      
      setTimeout(() => {
        setIsAttacking(false);
        setAttackingWeapon(null);
        setShowReturnButton(true);
      }, 1500);
      return;
    }

    // 敵の反撃
    setTimeout(() => {
      // 敵の攻撃アニメーション開始
      setIsEnemyAttacking(true);
      
      // 敵の攻撃力に応じたスタミナダメージを計算
      const baseStaminaDamage = Math.floor(currentEnemy.attack / 8); // 攻撃力の1/8をスタミナダメージとする
      const staminaDamage = Math.max(5, Math.min(15, baseStaminaDamage)); // 最低5、最大15スタミナダメージ
      
      onConsumeStamina(staminaDamage);
      onAddBattleLog({ message: `${currentEnemy.name}の攻撃！ スタミナを${staminaDamage}消費しました！`, type: 'enemy' });
      
      // 攻撃アニメーション終了
      setTimeout(() => {
        setIsAttacking(false);
        setAttackingWeapon(null);
        setIsEnemyAttacking(false);
      }, 1500);
      
      // スタミナ切れチェック（反撃ダメージ後のスタミナが0以下の場合）
      if (player.stamina - staminaDamage <= 0) {
        setTimeout(() => {
          onAddBattleLog({ message: 'スタミナが尽きました！ 戦闘から離脱します...', type: 'system' });
          onEndBattle(false);
        }, 1000);
      }
    }, 1500);
  };

  const handleEscape = () => {
    onAddBattleLog({ message: '戦闘から逃げ出しました...', type: 'system' });
    setTimeout(() => {
      onEndBattle(false);
    }, 1000);
  };

  const handleUseItem = () => {
    if (player.inventory.items.stamina_potion <= 0) {
      onAddBattleLog({ message: 'スタミナ回復薬がありません！', type: 'error' });
      return;
    }
    
    onUseStaminaPotion();
    onAddBattleLog({ message: 'スタミナ回復薬を使用！ スタミナが全回復しました！', type: 'item' });
  };

  const handleReturnToDungeon = () => {
    onEndBattle(true);
  };

  const getEnemyHpPercent = () => {
    // gameStateから最新の敵の状態を取得
    const latestEnemy = dungeon.enemies[dungeon.currentEnemyIndex];
    if (!latestEnemy) return 0;
    const percent = (latestEnemy.currentHp / latestEnemy.maxHp) * 100;
    return Math.max(0, percent); // 0未満にならないように制限
  };

  const getStaminaPercent = () => {
    return (player.stamina / player.maxStamina) * 100;
  };

  const getEnemyHpStatus = () => {
    const hpPercent = getEnemyHpPercent();
    if (hpPercent > 50) return 'healthy';
    if (hpPercent > 25) return 'warning';
    return 'critical';
  };

  const getBattleBackground = () => {
    if (!dungeon.currentDungeon) return '/image/stage/溶接ダンジョン_戦闘時背景.png';
    
    const backgroundMap = {
      'cutting': '/image/stage/切削ダンジョン_戦闘時背景.png',
      'welding': '/image/stage/溶接ダンジョン_戦闘時背景.png',
      'polishing': '/image/stage/研磨ダンジョン_戦闘時背景.png',
      'training': '/image/stage/訓練時背景_道場.png'
    };
    
    return backgroundMap[dungeon.currentDungeon] || '/image/stage/溶接ダンジョン_戦闘時背景.png';
  };

  return (
    <div className="battle-screen">
      {/* 上部: ステータスバー */}
      <div className="status-bars">
        <div className="player-status-bar">
          <div className="status-label">スタミナ</div>
          <div className="status-gauge">
            <div 
              className="status-fill stamina-fill" 
              style={{ width: `${getStaminaPercent()}%` }}
            ></div>
            <span className="status-text">{player.stamina}/{player.maxStamina}</span>
          </div>
        </div>
        <div className="enemy-status-bar">
          <div className="status-label">敵HP</div>
          <div className="status-gauge">
            <div 
              className={`status-fill enemy-hp-fill ${getEnemyHpStatus()}`}
              style={{ width: `${isEnemyDefeated || (dungeon.enemies[dungeon.currentEnemyIndex]?.currentHp || 0) <= 0 ? 0 : getEnemyHpPercent()}%` }}
            ></div>
            <span className="status-text">
              {isEnemyDefeated || dungeon.enemies[dungeon.currentEnemyIndex]?.currentHp <= 0 ? 
                '0' : (dungeon.enemies[dungeon.currentEnemyIndex]?.currentHp || 0)}/{currentEnemy.maxHp}
            </span>
          </div>
        </div>
      </div>

      {/* 横画面戦闘シーン */}
      <div className="horizontal-battle-scene">
        <img 
          src={getBattleBackground()} 
          alt="戦闘背景"
          className="battle-bg-image"
        />
        
        <div className="characters-overlay">
          {/* プレイヤー側（左） */}
          <div className="character-display player-display">
            <img 
              src="/image/player/Player_Main.png" 
              alt="プレイヤー"
              className="character-image player-image"
            />
            <div className="character-info-panel">
              <div className="character-name">プレイヤー</div>
              <div className="character-level">Lv.{player.level}</div>
            </div>
          </div>

          {/* 敵側（右） */}
          <div className="character-display enemy-display enemy-character">
            {currentEnemy.image ? (
              <img 
                src={currentEnemy.image}
                alt={currentEnemy.name}
                className={`character-image enemy-image ${isEnemyDefeated ? 'defeated' : ''} ${isEnemyAttacking ? 'attacking' : ''}`}
              />
            ) : (
              <div className="enemy-placeholder">
                <div className="enemy-icon">敵</div>
              </div>
            )}
            <div className="character-info-panel">
              <div className="character-name">{currentEnemy.name}</div>
              <div className="character-type">
                {currentEnemy.isBoss ? 'ボス' : '通常'}
              </div>
              <div className="enemy-stats-mini">
                攻{currentEnemy.attack} 防{currentEnemy.defense}
              </div>
            </div>
          </div>
        </div>

        {/* 攻撃中の武器表示 */}
        {isAttacking && attackingWeapon && (
          <div className="attacking-weapon">
            <img 
              src={attackingWeapon.image} 
              alt={attackingWeapon.name}
              className="attacking-weapon-image"
            />
          </div>
        )}
      </div>

      {/* コマンドパネル */}
      <div className="command-panel">
        {showReturnButton ? (
          <button 
            onClick={handleReturnToDungeon}
            className="action-button return-button"
          >
            ← 戻る
          </button>
        ) : (
          <div className="battle-commands">
            <button 
              onClick={handleAttack}
              disabled={!selectedWeapon || player.stamina < calculateStaminaCost(selectedWeapon) || isEnemyDefeated}
              className="action-button attack-button"
            >
              攻撃
            </button>
            <button 
              onClick={handleUseItem}
              disabled={player.inventory.items.stamina_potion <= 0 || isEnemyDefeated}
              className="action-button item-button"
            >
              アイテム ({player.inventory.items.stamina_potion})
            </button>
            <button 
              onClick={handleEscape}
              disabled={isEnemyDefeated}
              className="action-button escape-button"
            >
              逃げる
            </button>
          </div>
        )}
      </div>

      {/* 武器選択 */}
      <div className="weapon-selection">
        <div className="weapon-title">武器選択</div>
        <div className="weapon-list">
          {equippedWeapons.map((weapon, index) => (
            <div 
              key={weapon.id}
              className={`weapon-option ${index === selectedWeaponIndex ? 'selected' : ''}`}
              onClick={() => setSelectedWeaponIndex(index)}
            >
              <img 
                src={weapon.image} 
                alt={weapon.name}
                className="weapon-option-image"
              />
              <div className="weapon-option-info">
                <div className="weapon-option-name">{weapon.name}</div>
                <div className="weapon-option-stats">
                  攻撃{weapon.baseAttack} | スタミナ{calculateStaminaCost(weapon)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 戦闘ログ */}
      <div className="battle-log">
        <div className="log-title">戦闘ログ</div>
        <div className="log-content">
          {ui.battleLog.slice(-3).map((logEntry, index) => {
            const message = typeof logEntry === 'string' ? logEntry : logEntry.message;
            const type = typeof logEntry === 'string' ? 'default' : logEntry.type;
            return (
              <div key={index} className={`log-entry log-${type}`}>
                {message}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BattleScreen; 