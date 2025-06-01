import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonToast } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import { Accordion } from '../stories/Menu/Accordion';
import { HostServerCard } from '../stories/Settings/HostServerCard';
import { useEffect, useState } from 'react';
import { Keyboard } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';
import axios from 'axios';

// redux
import { useSelector } from 'react-redux';

// components
import { MenuTile } from '../stories/Menu/MenuTile';

const Tab4: React.FC = () => {
	// キーボードが表示されているかどうかを追跡するステート
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
	
	// API通信テスト用のステート
	const [apiResponse, setApiResponse] = useState<string>('');
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	
	// サーバーURL情報を取得
	const host = useSelector((state: any) => state.server.host);
	const port = useSelector((state: any) => state.server.port);
	
	// 適切なURLを構築（host末尾のスラッシュを確認）
	const getServerUrl = () => {
		// hostにプロトコル（http://）が含まれているか確認
		const hasProtocol = host.startsWith('http://') || host.startsWith('https://');
		const baseUrl = hasProtocol ? host : `http://${host}`;
		
		// URLが正しく結合されるよう末尾のスラッシュを確認
		const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
		return `${normalizedBaseUrl}:${port}`;
	};

	// キーボードイベントのリスナーを設定
	useEffect(() => {
		 // リスナーを保持する変数
		let keyboardShowListener: PluginListenerHandle | undefined;
		let keyboardHideListener: PluginListenerHandle | undefined;

		// 非同期処理でリスナーを設定
		const setupListeners = async () => {
			// キーボードが表示された時のリスナー
			keyboardShowListener = await Keyboard.addListener('keyboardWillShow', () => {
				setIsKeyboardVisible(true);
			});

			// キーボードが非表示になった時のリスナー
			keyboardHideListener = await Keyboard.addListener('keyboardWillHide', () => {
				setIsKeyboardVisible(false);
			});
		};

		// リスナーをセットアップ
		setupListeners();

		// コンポーネントのアンマウント時にリスナーをクリーンアップ
		return () => {
			const cleanupListeners = async () => {
				if (keyboardShowListener) {
					keyboardShowListener.remove();
				}
				if (keyboardHideListener) {
					keyboardHideListener.remove();
				}
			};
			
			cleanupListeners();
		};
	}, []);
	
	// API通信テスト関数
	const testApiConnection = async () => {
		try {
			const serverUrl = getServerUrl();
			console.log(`APIリクエスト送信先: ${serverUrl}/health`);
			setToastMessage(`APIリクエスト送信中: ${serverUrl}/health`);
			setShowToast(true);
			
			// ヘルスチェックエンドポイントにリクエスト
			// より詳細なエラー情報を得るための設定
			const response = await axios.get(`${serverUrl}/health`, {
				timeout: 15000, // タイムアウトを15秒に延長
				headers: {
					'Accept': '*/*',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-alive',
				},
				// エラーハンドリングを改善
				validateStatus: (status) => {
					return status >= 200 && status < 600; // すべてのステータスコードを許容してエラーにならないように
				},
			});
			
			// レスポンス表示
			console.log('API応答:', response.data);
			setApiResponse(JSON.stringify(response.data));
			setToastMessage(`API通信成功: ${JSON.stringify(response.data)}`);
			setShowToast(true);
		} catch (error: any) {
			// より詳細なエラー情報を表示
			console.error('API通信エラー詳細:', error);
			let errorMessage = 'エラーの詳細:';
			
			if (error.response) {
				// サーバーからのレスポンスがある場合
				errorMessage += `\nステータス: ${error.response.status}`;
				errorMessage += `\nデータ: ${JSON.stringify(error.response.data)}`;
			} else if (error.request) {
				// リクエストは送られたがレスポンスがない場合
				errorMessage += '\nサーバーからの応答がありません';
				errorMessage += `\nリクエスト情報: ${JSON.stringify(error.request._currentUrl || error.request)}`;
			} else {
				// リクエスト設定中にエラーが発生
				errorMessage += `\nメッセージ: ${error.message}`;
			}
			
			if (error.code) {
				errorMessage += `\nエラーコード: ${error.code}`;
			}
			
			setApiResponse(errorMessage);
			setToastMessage(`API通信エラー: ${error.message || '不明なエラー'}`);
			setShowToast(true);
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Tab 4</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{/* <Accordion label="This is Menu" borderRadius={50} width="100px" height="100px" backgroundColor='#262626'/> */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Tab 4</IonTitle>
					</IonToolbar>
				</IonHeader>

                <p>ここは設定画面です。</p>

                <HostServerCard
                    host="http://localhost"
                    port="8000"
                    width="100%"
                    height="300px"
                />
                
                {/* API通信テスト用ボタン */}
				<div style={{ padding: '20px', textAlign: 'center' }}>
					<IonButton expand="block" onClick={testApiConnection}>
						API通信テスト
					</IonButton>
					{apiResponse && (
						<div style={{ 
							marginTop: '20px', 
							padding: '10px', 
							backgroundColor: '#f0f0f0',
							borderRadius: '8px',
							color: '#333'
						}}>
							<p>レスポンス:</p>
							<pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
								{apiResponse}
							</pre>
						</div>
					)}
				</div>

                {/* キーボードが表示されていない時のみMenuTileを表示 */}
                {!isKeyboardVisible && (
                    <MenuTile
                        primary
                        backgroundColor="#6100ff"
                        bottomMarginTop=""
                        height="100%"
                        label="Button"
                        menuAlignItems="center"
                        menuBtnLeft="50%"
                        menuBtnTop=""
                        menuJustifyContent="center"
                        menuMargin="0em"
                        menuTransform="translate(-50%, -50%)"
                        menuZIndex={10}
                        onClick={() => {}}
                        position="fixed"
                        accordionPosition="absolute"
                        bottom="0px"
                        variant="primary"
                        width="100vw"
                    />
                )}
                
                {/* 通信結果表示用トースト */}
				<IonToast
					isOpen={showToast}
					onDidDismiss={() => setShowToast(false)}
					message={toastMessage}
					duration={5000}
					position="top"
				/>
			</IonContent>
		</IonPage>
	);
};

export default Tab4;
