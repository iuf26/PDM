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
import { Plugins } from "@capacitor/core";
import { ItemAdd } from "./ItemAdd";
import { ItemProps } from "./ItemProps";
const { Network } = Plugins;
const { Storage } = Plugins;

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, saveItem } = useContext(ItemContext);
  const { userId } = useContext(AppContext);
  const [logout, setLogout] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  const [itemAddView, setItemAddView] = useState(false);
  const [stop, setStop] = useState(false);
  const [checkC,setCheckC] = useState(false);
  const [itemsToShow,setItemsShow] = useState<ItemProps[]>();

  useEffect(() => {
    console.log(logout);
  }, [logout]);
  const setItemOffline = async (value: string) => {
    await Storage.set({
      key: "add",
      value,
    });
  };
  Network.addListener("networkStatusChange", async (status) => {
    console.log("Network status changed in item list", status);
    if (status.connected) {
      let res = await getAddData();
      if (res && res.length > 0) {
        if (saveItem) {
          if (!stop) {
            for (let i = 0; i < res.length; i++) {
              saveItem(res[i]);
            }

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
    console.log("userdid:", value);
  };
  const removeName = async () => {
    await Storage.remove({ key: "name" });
  };
  const setOnlyLanded = () => {
      if(!checkC){
        setItemsShow(items?.filter(elem => elem.landed === true))
      }else{
        setItemsShow(items)
      }
      setCheckC(!checkC);
   
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
