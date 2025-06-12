import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { 
    startAuthentication, 
    setAuthenticated, 
    setAuthenticationError, 
    clearAuthentication,
    clearError,
    restoreAuthenticationFromStorage,
    NgrokAuthStatus
} from '../redux/ngrokAuthSlice';

/**
 * ngrok認証状態を管理するカスタムフック
 */
export const useNgrokAuth = () => {
    const dispatch = useDispatch();
    
    // Redux状態からngrok認証情報を取得
    const authState = useSelector((state: RootState) => state.ngrokAuth);
    
    const actions = {
        /**
         * 認証プロセスを開始
         */
        startAuth: () => {
            dispatch(startAuthentication());
        },
        
        /**
         * 認証成功時の処理
         */
        setAuthSuccess: (token: string) => {
            dispatch(setAuthenticated({ token }));
        },
        
        /**
         * 認証失敗時の処理
         */
        setAuthError: (error: string) => {
            dispatch(setAuthenticationError(error));
        },
        
        /**
         * 認証をクリア（ログアウト）
         */
        logout: () => {
            dispatch(clearAuthentication());
        },
        
        /**
         * エラーメッセージをクリア
         */
        clearAuthError: () => {
            dispatch(clearError());
        },
        
        /**
         * ローカルストレージから認証状態を復元
         */
        restoreAuth: () => {
            dispatch(restoreAuthenticationFromStorage());
        }
    };
    
    // 便利な状態チェック関数
    const isAuthenticated = authState.status === 'authenticated';
    const isAuthenticating = authState.status === 'authenticating';
    const isUnauthenticated = authState.status === 'unauthenticated';
    const hasError = !!authState.error;
    const hasToken = !!authState.authToken;
    
    return {
        // 状態
        status: authState.status,
        authToken: authState.authToken,
        error: authState.error,
        lastAuthenticatedAt: authState.lastAuthenticatedAt,
        
        // 状態チェック関数
        isAuthenticated,
        isAuthenticating,
        isUnauthenticated,
        hasError,
        hasToken,
        
        // アクション
        ...actions
    };
};

/**
 * ngrok認証状態のセレクター関数
 */
export const selectNgrokAuthStatus = (state: RootState): NgrokAuthStatus => 
    state.ngrokAuth.status;

export const selectNgrokAuthToken = (state: RootState): string | undefined => 
    state.ngrokAuth.authToken;

export const selectNgrokAuthError = (state: RootState): string | undefined => 
    state.ngrokAuth.error;

export const selectIsNgrokAuthenticated = (state: RootState): boolean => 
    state.ngrokAuth.status === 'authenticated';

export const selectIsNgrokAuthenticating = (state: RootState): boolean => 
    state.ngrokAuth.status === 'authenticating';
