import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import { Accordion } from '../stories/Menu/Accordion';

// components
import { MenuTile } from '../stories/Menu/MenuTile';

const Tab4: React.FC = () => {
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
				<ExploreContainer name="Tab 4 page" />

                <p>ここは設定画面です。</p>

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

export default Tab4;
