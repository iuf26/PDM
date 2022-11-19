import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import {
  IonButton,
  IonCheckbox,
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

import { ItemAdd } from "./ItemAdd";
import { ItemProps } from "./ItemProps";
import { Preferences } from '@capacitor/preferences';
import {Network} from '@capacitor/network'
import { base64FromPath } from "../hooks/usePhotoGallery";
import { Directory, Filesystem } from "@capacitor/filesystem";

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, saveItem } = useContext(ItemContext);
  const { userId } = useContext(AppContext);
  const [logout, setLogout] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  const [itemAddView, setItemAddView] = useState(false);
  const [stop,setStop] = useState(false);
  const [filter,setFilter] = useState(false);
  const [check,setCheck] = useState(false);
  const [elemsToDisplay,setElemsToDisplay] = useState<ItemProps[]>()
 
  useEffect(() => {
    console.log(logout);
  }, [logout]);

  const setItemOffline = async (value: string) => {
    await Preferences.set({
      key: "add",
      value,
    });
  };
  Network.addListener("networkStatusChange", async (status:any) => {
    console.log("Network status changed in item list", status);
    if (status.connected) {
      let res = await getAddData();
      if (res && res.length > 0) {
        if (saveItem) {
          if(!stop){
          
            saveItem(res[0]);
          

            await setItemOffline(JSON.stringify([]));
            setStop(true);
          }
        }
      }
    } else {
      setStop(false);
    }

    setNetworkStatus(status.connected);
  });
  const getAddData = async () => {
    let res = (await Preferences.get({ key: "add" })).value;
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
    await Preferences.set({
      key: "name",
      value: "Max",
    });
  };
  // const setOnlyLanded = () => {
  //     if(!check) {
  //       setElemsToDisplay(items?.filter(elem => elem.landed === true))
  //     }else{
  //       setElemsToDisplay(items);
  //     }
  //     setCheck(!check);
  // }
  const checkName = async () => {
    const { value } = await Preferences.get({ key: "name" });

    console.log(`Hello ${value}!`);
  };
  const checkUserId = async () => {
    const { value } = await Preferences.get({ key: "userId" });
    console.log("userdid:", value);
  };
  const removeName = async () => {
    await Preferences.remove({ key: "name" });
  };
  
  useEffect(() => {
    checkUserId();
  }, [networkStatus]);
  return (
    <>
      {!logout ? (
        localStorage.getItem("token") ? (
          itemAddView ? (
            <ItemAdd netStat={networkStatus} goBack={setItemAddView} />
          ) : (
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
                {/* <label>Show only landed </label>
                <IonCheckbox onClick={() => setOnlyLanded()}></IonCheckbox> */}
                <IonButton>
                  Network status:{networkStatus ? "online" : "offline"}
                </IonButton>
                <IonLoading isOpen={fetching} message="Fetching items" />

                <SearchBar />

                <br></br>
                <InfiniteScroll history={history} />
                {fetchingError && (
                  <div>{fetchingError.message || "Failed to fetch items"}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                  <IonFabButton onClick={() => setItemAddView(true)}>
                    <IonIcon icon={add} />
                  </IonFabButton>
                </IonFab>
              </IonContent>
            </IonPage>
          )
        ) : (
          <div>You do not have acces to items...</div>
        )
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default ItemList;

