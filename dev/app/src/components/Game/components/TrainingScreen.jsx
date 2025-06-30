import React, { useState, useEffect } from 'react';
import { loadQuizData } from '../gameData.js';
import './TrainingScreen.css';

const TrainingScreen = ({ gameState, onChangeScreen, onUnlockRandomWeapon }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // ガチャ演出用の状態
  const [showGacha, setShowGacha] = useState(false);
  const [gachaWeapon, setGachaWeapon] = useState(null);
  const [gachaAnimation, setGachaAnimation] = useState('spinning');

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const quizData = await loadQuizData();
        setQuizzes(quizData);
        setIsLoading(false);
      } catch (error) {
        console.error('クイズデータの読み込みに失敗しました:', error);
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, []);

  const currentQuiz = quizzes[currentQuizIndex];

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuizIndex + 1;
    
    if (nextIndex < quizzes.length) {
      setCurrentQuizIndex(nextIndex);
      setSelectedAnswer('');
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // クイズ完了時に武器ガチャを実行
      startWeaponGacha();
    }
  };

  // 武器ガチャ演出を開始
  const startWeaponGacha = () => {
    setShowGacha(true);
    setGachaAnimation('spinning');
    
    // 3秒間のスピン演出
    setTimeout(() => {
      const unlockedWeapon = onUnlockRandomWeapon();
      setGachaWeapon(unlockedWeapon);
      setGachaAnimation('revealed');
      
      // さらに3秒後に完了画面に移行
      setTimeout(() => {
        setIsComplete(true);
        setShowGacha(false);
      }, 3000);
    }, 3000);
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setScore(0);
    setIsComplete(false);
    setShowGacha(false);
    setGachaWeapon(null);
    setGachaAnimation('spinning');
  };

  if (isLoading) {
    return (
      <div className="training-screen">
        <div className="loading-container">
          <div className="loading-text">クイズデータを読み込み中...</div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="training-screen">
        <div className="error-container">
          <div className="error-text">クイズデータが見つかりません</div>
          <button onClick={() => onChangeScreen('main')} className="back-btn">
            メインに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="training-screen">
      {/* ヘッダー */}
      <div className="training-header">
        <button onClick={() => onChangeScreen('main')} className="back-btn">
          ← メインに戻る
        </button>
        <div className="training-title">溶接トレーニング</div>
      </div>

      {/* 上部：戦闘エリア（背景・プレイヤー・敵） */}
      <div className="training-battle-area">
        {/* 背景画像 */}
        <div className="training-background">
          <img 
            src="/image/stage/訓練時背景_道場.png" 
            alt="道場"
            className="stage-background"
          />
        </div>

        {/* プレイヤー表示 */}
        <div className="training-player">
          <img 
            src="/image/player/Player_training.png" 
            alt="プレイヤー"
            className="player-image"
          />
        </div>

        {/* 敵（案山子）表示 */}
        <div className="training-enemy">
          <img 
            src="/image/enemy/トレーニング/藁の案山子_道場.png" 
            alt="案山子"
            className="enemy-image"
          />
        </div>
      </div>

      {/* 下部：クイズエリア */}
      <div className="training-quiz-area">
        {!isComplete ? (
          <div className="quiz-container">
            {/* 進捗表示 */}
            <div className="quiz-progress">
              <div className="progress-text">
                問題 {currentQuizIndex + 1} / {quizzes.length}
              </div>
              <div className="progress-score">
                正解数: {score}
              </div>
            </div>

            {/* 問題表示 */}
            <div className="quiz-question">
              <h3>{currentQuiz.question}</h3>
            </div>

            {/* 選択肢 */}
            <div className="quiz-options">
              {Object.entries(currentQuiz.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  className={`option-btn ${selectedAnswer === key ? 'selected' : ''} ${
                    showResult 
                      ? key === currentQuiz.correctAnswer 
                        ? 'correct' 
                        : key === selectedAnswer && key !== currentQuiz.correctAnswer 
                          ? 'incorrect' 
                          : ''
                      : ''
                  }`}
                  disabled={showResult}
                >
                  <span className="option-letter">{key}.</span>
                  <span className="option-text">{value}</span>
                </button>
              ))}
            </div>

            {/* 結果表示 */}
            {showResult && (
              <div className="quiz-result">
                <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? '正解！' : '不正解...'}
                </div>
                <div className="explanation">
                  <strong>解説:</strong> {currentQuiz.explanation}
                </div>
                <button onClick={handleNextQuestion} className="next-btn">
                  {currentQuizIndex + 1 < quizzes.length ? '次の問題' : '結果を見る'}
                </button>
              </div>
            )}

            {/* 回答ボタン */}
            {!showResult && (
              <div className="quiz-actions">
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="submit-btn"
                >
                  回答する
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 最終結果 */
          <div className="quiz-complete">
            <div className="complete-title">トレーニング完了！</div>
            <div className="final-score">
              最終スコア: {score} / {quizzes.length} 
              ({Math.round((score / quizzes.length) * 100)}%)
            </div>
            <div className="score-message">
              {score === quizzes.length ? '完璧です！溶接マスターですね！' :
               score >= quizzes.length * 0.8 ? '素晴らしい！かなり理解できています！' :
               score >= quizzes.length * 0.6 ? '良い結果です！もう少し頑張りましょう！' :
               '基礎から復習してみましょう！'}
            </div>
            <div className="complete-actions">
              <button onClick={handleRestart} className="restart-btn">
                もう一度挑戦
              </button>
              <button onClick={() => onChangeScreen('main')} className="finish-btn">
                メインに戻る
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ガチャ演出画面 */}
      {showGacha && (
        <div className="gacha-overlay">
          <div className="gacha-container">
            <div className="gacha-title">新しい武器を獲得しました！</div>
            
            {gachaAnimation === 'spinning' ? (
              <div className="gacha-spinning">
                <div className="gacha-spinner"></div>
                <div className="gacha-text">抽選中...</div>
              </div>
            ) : (
              <div className="gacha-result">
                <div className="weapon-reveal">
                  {gachaWeapon ? (
                    <>
                      <img 
                        src={gachaWeapon.image} 
                        alt={gachaWeapon.name}
                        className="gacha-weapon-image"
                      />
                      <div className="gacha-weapon-info">
                        <div className="gacha-weapon-name">{gachaWeapon.name}</div>
                        <div className="gacha-weapon-rarity">{gachaWeapon.rarity}</div>
                        <div className="gacha-weapon-attribute">{gachaWeapon.attribute}</div>
                      </div>
                    </>
                  ) : (
                    <div className="no-weapon-message">
                      すべての武器が解放済みです！
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingScreen;