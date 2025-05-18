import react from 'react';
import { useIonRouter } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

// components
// 外部コンポーネントをインポートする場合利用

// css
import './Event.css';

// コンポーネントの型定義
export interface EventProps {   // props（パラメータ）の型定義
    primary?: boolean;          // プライマリーボタンかどうか
    color ?: string;            // ボタンの色
    backgroundColor?: string;   // ボタンの背景色
    onClick?: () => void;       // クリック時のイベントハンドラー
}

// コンポーネントの定義(props値を受け取る)
export const Event = ({
    primary = false,
    color,
    backgroundColor,
    onClick,
    ...props
}: EventProps) => {
    // router
    const ionRouter = useIonRouter();
    // Redux
    const dispatch = useDispatch();                                             // 状態を更新するためのdispatch関数を取得
    const menuIsOpen = useSelector((state: RootState) => state.menu.isOpen);    // Reduxストアから状態を取得

    return (
        <div>
            <p> This is Components </p>
        </div>
    );
};