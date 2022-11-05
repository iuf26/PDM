import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import Item from "./Item";
import { getLogger } from "../core";
import { ItemContext } from "./ItemProvider";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { SearchBar } from "../components/SearchBar";
import { AppContext } from "../components/AppContext";
//import { Network } from '../../node_modules/@capacitor/network';
import { Plugins } from "@capacitor/core";
const { Network } = Plugins;
const {Storage} = Plugins;


const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError,saveItem } = useContext(ItemContext);
  const { userId } = useContext(AppContext);
  const [logout, setLogout] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  useEffect(() => {
    console.log(logout);
  }, [logout]);
  const setItemOffline = async (value: string) => {
    await Storage.set({
      key: "add",
      value,
    });
  };
  Network.addListener("networkStatusChange",async (status) => {
    console.log("Network status changed", status);
    if(status.connected){
      let res = await getAddData();
      if (res && res.length > 0) {
        if (res[0] && saveItem) {
          await saveItem(res[0]);

          await setItemOffline(JSON.stringify([]));
        }
      }
    }
    setNetworkStatus(status.connected);
  });
  const getAddData = async () => {
    let res = (await Storage.get({ key: "add" })).value;
    if (res) {
      return JSON.parse(res);
    }
    return res;
  };
  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();

    console.log("Network status:", status);
  };
  const setName = async () => {
    await Storage.set({
      key: "name",
      value: "Max",
    });
  };

  const checkName = async () => {
    const { value } = await Storage.get({ key: "name" });

    console.log(`Hello ${value}!`);
  };
  const checkUserId = async () => {
    const { value } = await Storage.get({ key: "userId" });
    console.log("userdid:",value);
  }
  const removeName = async () => {
    await Storage.remove({ key: "name" });
  };

  useEffect(() => {
   checkUserId() 
  },[networkStatus])
  return (
    <>
      {!logout ? (
        localStorage.getItem("token") ? (
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonTitle>My App</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonButton
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  setLogout(true);
                }}
              >
                Log out
              </IonButton>
              <IonButton>
                Network status:{networkStatus ? "online" : "offline"}
              </IonButton>
              <IonLoading isOpen={fetching} message="Fetching items" />
              {/* {items && (
              <IonList>
              {items.map(({ id, airlineCode,estimatedArrival,landed}) =>
              <Item key={id} id={id} airlineCode={airlineCode} estimatedArrival = {estimatedArrival} landed = {landed} onEdit={id => history.push(`/item/${id?.toString()}`)} />)}
              </IonList>
            )} */}
              <SearchBar />

              <br></br>
              <InfiniteScroll history={history} />
              {fetchingError && (
                <div>{fetchingError.message || "Failed to fetch items"}</div>
              )}
              <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={() => history.push("/item")}>
                  <IonIcon icon={add} />
                </IonFabButton>
              </IonFab>
            </IonContent>
          </IonPage>
        ) : (
          <div>Retrieving items...</div>
        )
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default ItemList;
