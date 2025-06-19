import { Redirect, Route } from 'react-router-dom';
import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import EventPage from './pages/EventPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
    platform: {
      /** The default `desktop` function returns false for devices with a touchscreen.
       * This is not always wanted, so this function tests the User Agent instead.
       **/
      // windows
      desktop: (win) => {
				const forcePlatform = localStorage.getItem('forcePlatform');
				if (forcePlatform === 'desktop') {
					return true;
				}
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
        return !isMobile;
      },
      // android
      android: (win) => {
				const forcePlatform = localStorage.getItem('forcePlatform');
				if (forcePlatform === 'android') {
					return true;
				}
				const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);

				return isMobile && /Android/i.test(win.navigator.userAgent);
			},
			// iOS
			ios: (win) => {
				const forcePlatform = localStorage.getItem('forcePlatform');
				if (forcePlatform === 'ios') {
					return true;
				}
				const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
				return isMobile && /iPhone|iPad|iPod/i.test(win.navigator.userAgent);
			},
		}
});

const App: React.FC = () => (
	<IonApp>
		<IonReactRouter>
			<IonTabs>
				<IonRouterOutlet>
					<Route exact path="/tab1">
						<Tab1 />
					</Route>
					<Route exact path="/tab2">
						<Tab2 />
					</Route>
					<Route path="/tab3">
						<Tab3 />
					</Route>
                    <Route path="/tab4">
                        <Tab4 />
                    </Route>
					<Route exact path="/">
						<Redirect to="/tab1" />
					</Route>
                    <Route path="/event/:eventId" exact={true}>
                        <EventPage />
                    </Route>
                    <Route exact path="/event">
                        <div>イベントIDが指定されていません。</div>
                    </Route>
				</IonRouterOutlet>
				{/* <IonTabBar slot="bottom">
					<IonTabButton tab="tab1" href="/tab1">
						<IonIcon aria-hidden="true" icon={triangle} />
						<IonLabel>Tab 1</IonLabel>
					</IonTabButton>
					<IonTabButton tab="tab2" href="/tab2">
						<IonIcon aria-hidden="true" icon={ellipse} />
						<IonLabel>Tab 2</IonLabel>
					</IonTabButton>
					<IonTabButton tab="tab3" href="/tab3">
						<IonIcon aria-hidden="true" icon={square} />
						<IonLabel>Tab 3</IonLabel>
					</IonTabButton>`
					<IonTabButton tab="tab4" href="/tab4">
						<IonIcon aria-hidden="true" icon={square} />
						<IonLabel>Tab 4</IonLabel>
					</IonTabButton>
                    
				</IonTabBar> */}
			</IonTabs>
		</IonReactRouter>
	</IonApp>
);

export default App;
