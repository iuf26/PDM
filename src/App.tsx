import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ItemEdit, ItemList } from "./todo";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { ItemProvider } from "./todo/ItemProvider";
import { ItemAdd } from "./todo/ItemAdd";
import { Login } from "./components/Login";
import { AppContextProvider } from "./components/AppContext";

import { AuthProvider } from "./components/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";

import { Network } from '@capacitor/network';
import { animationBuilder } from "./hooks/animations";
Network.addListener("networkStatusChange", async (status:any) => {
  localStorage.setItem("net", status.connected.toString());
});


const App: React.FC = () => (
  
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet animation={animationBuilder}>
          <AuthProvider>
            <Route path="/login" component={Login} exact={true} />
            <ItemProvider>
              <PrivateRoute path="/items" component={ItemList} exact={true} />
              <PrivateRoute path="/item" component={ItemAdd} exact={true} />
              <PrivateRoute
                path="/item/:id"
                component={ItemEdit}
                exact={true}
              />
            </ItemProvider>
            <Route exact path="/" render={() => <Redirect to="/items" />} />
          </AuthProvider>
          {/* <Route path="/items" component={ItemList} exact={true} />
            <Route path="/item" component={ItemAdd} exact={true} />
            <Route path="/item/:id" component={ItemEdit} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route exact path="/login" render={() => <Login />} /> */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
 
);

export default App;
