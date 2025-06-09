import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';

const host = useSelector((state: RootState) => state.server.host);
const port = useSelector((state: RootState) => state.server.port);

// APIのベースURLを設定
const API_BASE_URL = port ? `${host}:${port}` : `${host}`;
export const apiConnector = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// リクエストのインターセプターを設定
apiConnector.interceptors.request.use(
    (config) => {
        // リクエストが送信される前に何らかの処理を行うことができます
        // 例: 認証トークンの追加など
        return config;
    },
    (error) => {
        // リクエストエラーの処理
        return Promise.reject(error);
    }
);