import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Accordion } from '../stories/Menu/Accordion';

const Tab1: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Tab 1</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<Accordion label="This is Menu" borderRadius={50} width="100px" height="100px" backgroundColor='#262626'/>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Tab 1</IonTitle>
					</IonToolbar>
				</IonHeader>
				<ExploreContainer name="Tab 1 page" />
			</IonContent>
		</IonPage>
	);
};

export default Tab1;
