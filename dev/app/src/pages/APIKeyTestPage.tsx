import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { APIKeyCard } from '../stories/Settings/APIKeyCard';

/**
 * APIKeyCard機能テスト用ページ
 * 実際の動作確認とテストに使用
 */
const APIKeyTestPage: React.FC = () => {
    return (
        <Provider store={store}>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>APIキー管理機能テスト</IonTitle>
                    </IonToolbar>
                </IonHeader>
                
                <IonContent className="ion-padding">
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '20px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <h2>APIKeyCard コンポーネントテスト</h2>
                        
                        <div style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '20px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h3>基本動作テスト</h3>
                            <p>以下の機能をテストしてください：</p>
                            <ul>
                                <li>✅ APIキーの入力</li>
                                <li>✅ APIキーのバリデーション</li>
                                <li>✅ パスワード表示/非表示の切り替え</li>
                                <li>✅ APIキーの保存</li>
                                <li>✅ 保存済みAPIキーの読み込み</li>
                                <li>✅ APIキーのマスキング表示</li>
                                <li>✅ APIキーの削除</li>
                                <li>✅ エラーメッセージの表示</li>
                                <li>✅ 成功メッセージの表示</li>
                            </ul>
                        </div>
                        
                        {/* APIKeyCardコンポーネント */}
                        <APIKeyCard 
                            width="100%"
                            title="Gemini API設定 - テスト用"
                        />
                        
                        <div style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '20px',
                            backgroundColor: '#fff3cd'
                        }}>
                            <h3>テスト手順</h3>
                            <ol>
                                <li><strong>有効なAPIキーでテスト:</strong><br/>
                                    <code>AIzaSyDtestkey123456789abcdefghijklmnop</code>
                                </li>
                                <li><strong>無効なAPIキーでテスト:</strong><br/>
                                    <code>invalid_key</code> または短すぎるキー
                                </li>
                                <li><strong>空の状態でテスト:</strong><br/>
                                    何も入力せずに保存ボタンを押す
                                </li>
                                <li><strong>表示/非表示切り替えテスト:</strong><br/>
                                    目のアイコンをクリックしてパスワード表示を切り替え
                                </li>
                                <li><strong>保存・削除テスト:</strong><br/>
                                    有効なAPIキーを保存後、削除ボタンでクリア
                                </li>
                            </ol>
                        </div>
                        
                        <div style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '20px',
                            backgroundColor: '#d1ecf1'
                        }}>
                            <h3>Redux State確認</h3>
                            <p>ブラウザのコンソールで以下を実行してRedux状態を確認：</p>
                            <pre style={{ 
                                backgroundColor: '#f8f9fa', 
                                padding: '10px', 
                                borderRadius: '4px',
                                overflow: 'auto'
                            }}>
                                <code>
{`// Redux状態確認
console.log('現在のRedux状態:', window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);

// または
console.log('env状態:', store.getState().env);

// テスト関数実行（存在する場合）
if (window.runApiKeyTests) {
    window.runApiKeyTests();
}`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </Provider>
    );
};

export default APIKeyTestPage;
