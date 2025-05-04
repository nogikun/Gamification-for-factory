import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Accordion } from '../stories/Menu/Accordion';
import { MenuTile } from '../stories/Menu/MenuTile';
import { isPlatform, getPlatforms } from '@ionic/react';

import { useSelector } from 'react-redux';
import { DateTile } from '../stories/Search/DateTile';
import { CardComponent } from '../stories/Search/Card';

console.log("getPlatforms", getPlatforms());

const Tab1: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					{/* <IonTitle>Tab 1</IonTitle> */}
                    <DateTile
                        selectedDate="2025-05-05"
                        termDays={2}
                        spaceBetween='20px'
                        horizonMargin='7px'
                        marginTop= {isPlatform('ios') ? '15px' : isPlatform('android') ? '50px' : '15px'}
                        marginBottom='15px'
                    />
                </IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{/* <Accordion label="This is Menu" borderRadius={50} width="100px" height="100px" backgroundColor='#262626'/> */}
                {/* <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tab 1</IonTitle>
                    </IonToolbar>
                </IonHeader> */}

				{/* <ExploreContainer name="Tab 1 page" /> */}

                <p>ここは検索画面です。</p>
                
                <div style={{
                    // justifyContent: 'space-between', // 日付を横並びに配置
                    // padding: 'auto 20px',
                    textAlign: 'center',
                }}>
                    <p style={{fontSize:"18px", marginBottom: "3px"}}>選択された日付</p>
                    <p style={{fontSize:"24px", marginTop: "0px"}}>{useSelector((state: any) => state.searchDate.selectedDate)}</p>
                </div>
                
                <div style={{
                    justifyContent: 'space-between', // 日付を横並びに配置
                    padding: 'auto 20px',
                    textAlign: 'center',
                }}>
                <CardComponent
                backgroundColor="#333333"
                base64Image=""
                borderRadius="10px"
                campany="Automation 株式会社"
                color="#ffffff"
                currencySymbol="¥"
                details="詳細情報"
                endDate="2023-10-31"
                height="100px"
                onClick={() => {}}
                paying={7000}
                startDate="2023-10-01"
                tags={[
                    {
                    color: '#ff0000',
                    label: '溶接'
                    },
                    {
                    color: '#00ff00',
                    label: '金属加工'
                    }
                ]}
                title="1day インターンシップ"
                width="80px"
                />
                <CardComponent
                backgroundColor="#333333"
                base64Image=""
                borderRadius="10px"
                campany="Automation 株式会社"
                color="#ffffff"
                currencySymbol="¥"
                details="詳細情報"
                endDate="2023-10-31"
                height="100px"
                onClick={() => {}}
                paying={7000}
                startDate="2023-10-01"
                tags={[
                    {
                    color: '#ff0000',
                    label: '溶接'
                    },
                    {
                    color: '#00ff00',
                    label: '金属加工'
                    }
                ]}
                title="1day インターンシップ"
                width="80px"
                />
                <CardComponent
                backgroundColor="#333333"
                base64Image=""
                borderRadius="10px"
                campany="Automation 株式会社"
                color="#ffffff"
                currencySymbol="¥"
                details="詳細情報"
                endDate="2023-10-31"
                height="100px"
                onClick={() => {}}
                paying={7000}
                startDate="2023-10-01"
                tags={[
                    {
                    color: '#ff0000',
                    label: '溶接'
                    },
                    {
                    color: '#00ff00',
                    label: '金属加工'
                    }
                ]}
                title="1day インターンシップ"
                width="80px"
                />
                <CardComponent
                backgroundColor="#333333"
                base64Image=""
                borderRadius="10px"
                campany="Automation 株式会社"
                color="#ffffff"
                currencySymbol="¥"
                details="詳細情報"
                endDate="2023-10-31"
                height="100px"
                onClick={() => {}}
                paying={7000}
                startDate="2023-10-01"
                tags={[
                    {
                    color: '#ff0000',
                    label: '溶接'
                    },
                    {
                    color: '#00ff00',
                    label: '金属加工'
                    }
                ]}
                title="1day インターンシップ"
                width="80px"
                />
                </div>

                {/* 空白分を確保する必要がある（現在は臨時） */}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

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
