import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Accordion } from '../stories/Menu/Accordion';
import { MenuTile } from '../stories/Menu/MenuTile';

const Tab1: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					{/* <IonTitle>Tab 1</IonTitle> */}
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{/* <Accordion label="This is Menu" borderRadius={50} width="100px" height="100px" backgroundColor='#262626'/> */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Tab 1</IonTitle>
					</IonToolbar>
				</IonHeader>
				<ExploreContainer name="Tab 1 page" />

                <p>ここは検索画面です。</p>

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
			</IonContent>
		</IonPage>
	);
};

export default Tab1;
