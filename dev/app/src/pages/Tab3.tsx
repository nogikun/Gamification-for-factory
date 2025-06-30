import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';

// components
import { MenuTile } from '../stories/Menu/MenuTile';
import { FeedbackTab } from '../stories/Feedback/FeedbackTab';

const Tab3: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Tab 3</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Tab 3</IonTitle>
					</IonToolbar>
				</IonHeader>
				{/* <ExploreContainer name="Tab 3 page" /> */}

                <p>ここはあしあと機能の画面です。</p>

                <FeedbackTab
                    primary
                    color="#6100ff"
                    backgroundColor="#6100ff"
                    width="100%"
                    height="100%"
                    // user_id="11111111-1111-1111-1111-111111111111" // テスト用のUUID
                    aiReview="AIによるレビュー内容がここに表示されます。"
                    onClick={() => {}}
                />

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

export default Tab3;
