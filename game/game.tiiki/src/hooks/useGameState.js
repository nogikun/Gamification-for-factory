import { useState, useEffect } from 'react';
import { WEAPONS, ENEMIES, DUNGEONS, calculateTotalExpForLevel, calculateRequiredExp, updateGameDataFromAdjustment } from '../gameData.js';

// 初期ゲーム状態
const initialGameState = {
  player: {
    level: 1,
    exp: 0,
    stamina: 100,
    maxStamina: 100,
    inventory: {
      weapons: [
        WEAPONS.cutting_light_N.id
      ],
      items: {
        stamina_potion: 5
      }
    },
    equippedWeapons: [WEAPONS.cutting_light_N.id, null, null, null] // 4装備枠
  },
  dungeon: {
    currentDungeon: null,
    currentEnemyIndex: 0,
    enemies: [],
    inBattle: false
  },
  ui: {
    currentScreen: 'main', // main, dungeon, battle, inventory
    battleLog: []
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  // 調整データを初期化時に読み込み
  useEffect(() => {
    updateGameDataFromAdjustment().catch(console.warn);
  }, []);

  // レベルアップチェック
  useEffect(() => {
    const checkLevelUp = () => {
      const currentLevel = gameState.player.level;
      const currentExp = gameState.player.exp;
      const nextLevelRequirement = calculateTotalExpForLevel(currentLevel + 1);
      
      if (currentExp >= nextLevelRequirement && currentLevel < 50) {
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            level: currentLevel + 1
          },
          ui: {
            ...prev.ui,
            battleLog: [...prev.ui.battleLog, { message: `レベルアップ！ Lv${currentLevel + 1}になりました！`, type: 'system' }]
          }
        }));
      }
    };
    
    checkLevelUp();
  }, [gameState.player.exp]);

  // 武器を装備する
  const equipWeapon = (weaponId, slotIndex) => {
    if (slotIndex < 0 || slotIndex >= 4) return;
    
    setGameState(prev => {
      const newEquipped = [...prev.player.equippedWeapons];
      newEquipped[slotIndex] = weaponId;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          equippedWeapons: newEquipped
        }
      };
    });
  };

  // 武器の装備を外す
  const unequipWeapon = (slotIndex) => {
    if (slotIndex < 0 || slotIndex >= 4) return;
    
    setGameState(prev => {
      const newEquipped = [...prev.player.equippedWeapons];
      newEquipped[slotIndex] = null;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          equippedWeapons: newEquipped
        }
      };
    });
  };

  // ダンジョンに入場
  const enterDungeon = (dungeonId) => {
    const dungeon = DUNGEONS[dungeonId];
    if (!dungeon) {
      console.error(`ダンジョンID '${dungeonId}' が見つかりません`);
      return;
    }
    
    const enemies = dungeon.enemies.map(enemyId => ({
      ...ENEMIES[enemyId],
      currentHp: ENEMIES[enemyId].maxHp
    }));
    
    setGameState(prev => ({
      ...prev,
      dungeon: {
        currentDungeon: dungeonId,
        currentEnemyIndex: 0,
        enemies: enemies,
        inBattle: false
      },
      ui: {
        ...prev.ui,
        currentScreen: 'dungeon'
      }
    }));
  };

  // 戦闘開始
  const startBattle = () => {
    setGameState(prev => ({
      ...prev,
      dungeon: {
        ...prev.dungeon,
        inBattle: true
      },
      ui: {
        ...prev.ui,
        currentScreen: 'battle',
        battleLog: []
      }
    }));
  };

  // 戦闘終了
  const endBattle = (victory = false) => {
    setGameState(prev => {
      if (victory) {
        const currentEnemy = prev.dungeon.enemies[prev.dungeon.currentEnemyIndex];
        const newExp = prev.player.exp + currentEnemy.exp;
        
        // 次の敵がいるかチェック
        const nextEnemyIndex = prev.dungeon.currentEnemyIndex + 1;
        const hasNextEnemy = nextEnemyIndex < prev.dungeon.enemies.length;
        
        return {
          ...prev,
          player: {
            ...prev.player,
            exp: newExp
          },
          dungeon: {
            ...prev.dungeon,
            currentEnemyIndex: hasNextEnemy ? nextEnemyIndex : prev.dungeon.currentEnemyIndex,
            inBattle: false
          },
          ui: {
            ...prev.ui,
            currentScreen: hasNextEnemy ? 'dungeon' : 'main',
            battleLog: [
              ...prev.ui.battleLog,
              { message: `${currentEnemy.name}を倒しました！`, type: 'victory' },
              { message: `経験値 ${currentEnemy.exp} を獲得！`, type: 'system' },
              { message: hasNextEnemy ? '次の敵が待っています...' : 'ダンジョンクリア！', type: 'system' }
            ]
          }
        };
      } else {
        return {
          ...prev,
          dungeon: {
            ...prev.dungeon,
            inBattle: false
          },
          ui: {
            ...prev.ui,
            currentScreen: 'dungeon'
          }
        };
      }
    });
  };

  // スタミナ回復アイテム使用
  const useStaminaPotion = () => {
    setGameState(prev => {
      if (prev.player.inventory.items.stamina_potion <= 0) return prev;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          stamina: prev.player.maxStamina,
          inventory: {
            ...prev.player.inventory,
            items: {
              ...prev.player.inventory.items,
              stamina_potion: prev.player.inventory.items.stamina_potion - 1
            }
          }
        }
      };
    });
  };

  // スタミナ消費
  const consumeStamina = (amount) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        stamina: Math.max(0, prev.player.stamina - amount)
      }
    }));
  };

  // ダメージを与える
  const dealDamageToEnemy = (damage) => {
    setGameState(prev => {
      const enemies = [...prev.dungeon.enemies];
      const currentEnemy = enemies[prev.dungeon.currentEnemyIndex];
      currentEnemy.currentHp = Math.max(0, currentEnemy.currentHp - damage);
      
      return {
        ...prev,
        dungeon: {
          ...prev.dungeon,
          enemies: enemies
        }
      };
    });
  };

  // プレイヤーにダメージを与える（スタミナ消費）
  const takeDamage = (damage) => {
    consumeStamina(2); // 被ダメージ時のスタミナ消費
  };

  // 画面遷移
  const changeScreen = (screen) => {
    setGameState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        currentScreen: screen
      }
    }));
  };

  // バトルログ追加
  const addBattleLog = (logEntry) => {
    setGameState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        battleLog: [...prev.ui.battleLog, logEntry]
      }
    }));
  };

  // 武器解放システム
  const unlockRandomWeapon = () => {
    // 全武器リストから現在持っていない武器を取得
    const allWeapons = Object.values(WEAPONS);
    const unlockedWeapons = gameState.player.inventory.weapons;
    const availableWeapons = allWeapons.filter(weapon => !unlockedWeapons.includes(weapon.id));
    
    if (availableWeapons.length === 0) {
      return null; // すべての武器が解放済み
    }
    
    // ランダムで1つ選択
    const randomIndex = Math.floor(Math.random() * availableWeapons.length);
    const selectedWeapon = availableWeapons[randomIndex];
    
    // インベントリに追加
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        inventory: {
          ...prev.player.inventory,
          weapons: [...prev.player.inventory.weapons, selectedWeapon.id]
        }
      }
    }));
    
    return selectedWeapon;
  };

  // 武器を追加する関数
  const addWeaponToInventory = (weaponId) => {
    setGameState(prev => {
      if (prev.player.inventory.weapons.includes(weaponId)) {
        return prev; // 既に持っている場合は何もしない
      }
      
      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: {
            ...prev.player.inventory,
            weapons: [...prev.player.inventory.weapons, weaponId]
          }
        }
      };
    });
  };

  // 武器を削除する関数
  const removeWeaponFromInventory = (weaponId) => {
    setGameState(prev => {
      const newWeapons = prev.player.inventory.weapons.filter(id => id !== weaponId);
      const newEquippedWeapons = prev.player.equippedWeapons.map(id => id === weaponId ? null : id);
      
      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: {
            ...prev.player.inventory,
            weapons: newWeapons
          },
          equippedWeapons: newEquippedWeapons
        }
      };
    });
  };

  // デバッグ用数値変更機能
  const updateGameValues = (updates) => {
    // 武器データの更新をgameData.jsに直接反映
    if (updates.weapons) {
      Object.keys(updates.weapons).forEach(weaponId => {
        if (WEAPONS[weaponId]) {
          Object.assign(WEAPONS[weaponId], updates.weapons[weaponId]);
        }
      });
    }
    
    // 敵データの更新をgameData.jsに直接反映
    if (updates.enemies) {
      Object.keys(updates.enemies).forEach(enemyId => {
        if (ENEMIES[enemyId]) {
          Object.assign(ENEMIES[enemyId], updates.enemies[enemyId]);
        }
      });
    }
    
    // プレイヤーデータの更新
    if (updates.player) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          ...updates.player
        }
      }));
    }
    
    // インベントリの更新
    if (updates.inventory) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          inventory: {
            ...prev.player.inventory,
            ...updates.inventory
          }
        }
      }));
    }
    
    // 現在の戦闘中の敵データも更新
    if (updates.enemies && gameState.dungeon.inBattle) {
      setGameState(prev => {
        const enemies = prev.dungeon.enemies.map(enemy => {
          if (updates.enemies[enemy.id]) {
            return { ...enemy, ...updates.enemies[enemy.id] };
          }
          return enemy;
        });
        
        return {
          ...prev,
          dungeon: {
            ...prev.dungeon,
            enemies: enemies
          }
        };
      });
    }
  };

  return {
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
  };
}; 