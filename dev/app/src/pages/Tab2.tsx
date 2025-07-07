import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

// components
import { MenuTile } from '../stories/Menu/MenuTile';
// Game components
import GameApp from '../components/Game/GameApp';

const Tab2: React.FC = () => {
	return (
		<IonPage>
			<IonContent fullscreen>
				<div style={{ padding: '0', height: '100vh' }}>
					<GameApp />
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Tab2;
