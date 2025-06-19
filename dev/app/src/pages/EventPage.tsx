import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
// import ExploreContainer from '../components/ExploreContainer';
// import { Accordion } from '../stories/Menu/Accordion';
import { MenuTile } from '../stories/Menu/MenuTile';
// import { isPlatform, getPlatforms } from '@ionic/react';

// import { useSelector } from 'react-redux';
// import { DateTile } from '../stories/Search/DateTile';
// import { EventList } from '../stories/Search/EventList';
import { Event } from '../stories/Search/Event';
import { useParams } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';

// console.log("getPlatforms", getPlatforms());

const EventPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* <IonTitle>Tab 1</IonTitle> */}
                    {/* <DateTile
                        selectedDate="2025-05-05"
                        termDays={2}
                        spaceBetween='20px'
                        horizonMargin='7px'
                        marginTop= {isPlatform('ios') ? '15px' : isPlatform('android') ? '50px' : '15px'}
                        marginBottom='15px'
                    /> */}
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
                
                
                {/* <p>ここは検索画面です。</p>
                <div style={{
                    // justifyContent: 'space-between', // 日付を横並びに配置
                    // padding: 'auto 20px',
                    textAlign: 'center',
                }}>
                    <p style={{fontSize:"18px", marginBottom: "3px"}}>選択された日付</p>
                    <p style={{fontSize:"24px", marginTop: "0px"}}>{useSelector((state: any) => state.searchDate.selectedDate)}</p>
                </div> */}
                
                <div style={{
                    justifyContent: 'space-between', // 日付を横並びに配置
                    padding: 'auto 20px',
                    textAlign: 'center',
                }}>
                    <EventDisplay />
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

const EventDisplay: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    console.log(`EventPage.tsx (EventDisplay): eventId from useParams: ${eventId}, typeof: ${typeof eventId}`);
    const isValid = eventId && uuidValidate(eventId);
    console.log(`EventPage.tsx (EventDisplay): uuidValidate(${eventId}) result: ${isValid}`);

    if (!isValid) {
        return <div>指定されたイベントIDの形式が正しくないか、見つかりません。</div>;
    }

    // ここで eventId を使ってイベントの詳細情報を取得するロジックを実装
    // 例: const eventDetails = fetchEventDetails(eventId);

    return <Event
        event_id={eventId} // URLから取得した eventId を渡す
        zIndex={0}
        onClick={() => { /* 詳細ページ内でのクリックイベントなど */ }}
    />;
}

export default EventPage;
