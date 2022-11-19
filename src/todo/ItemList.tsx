import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import {
  createAnimation,
  CreateAnimation,
  IonButton,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonModal,
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
import { Preferences } from "@capacitor/preferences";
import { Network } from "@capacitor/network";
import { base64FromPath } from "../hooks/usePhotoGallery";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { MyMap } from "../components/MyMap";
import { useMyLocation } from "../hooks/useMyLocation";
import { Modal } from "./Modal";

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, saveItem } = useContext(ItemContext);
  const { userId } = useContext(AppContext);
  const [logout, setLogout] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  const [itemAddView, setItemAddView] = useState(false);
  const [stop, setStop] = useState(false);
  const [filter, setFilter] = useState(false);
  const [check, setCheck] = useState(false);
  const [elemsToDisplay, setElemsToDisplay] = useState<ItemProps[]>();
  const [playAddAnim, setPlayAddAnim] = useState(true);

  useEffect(() => {
    console.log(logout);
  }, [logout]);

  const setItemOffline = async (value: string) => {
    await Preferences.set({
      key: "add",
      value,
    });
  };
  Network.addListener("networkStatusChange", async (status: any) => {
    console.log("Network status changed in item list", status);
    if (status.connected) {
      let res = await getAddData();
      if (res && res.length > 0) {
        if (saveItem) {
          if (!stop) {
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
  const enterAnimation = (baseEl:any, opts:any) => {
    console.log(baseEl,"9099909");
   
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(opts.enteringEl)
      .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector(".modal-wrapper")!)
      .keyframes([
        { offset: 0, opacity: "0", transform: "scale(0)" },
        { offset: 1, opacity: "0.99", transform: "scale(1)" },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing("ease-out")
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };
  const leaveAnimation = (baseEl: any,opts:any) => {
    return enterAnimation(baseEl,opts).direction("reverse");
  };
  useEffect(() => {
    checkUserId();
  }, [networkStatus]);
  return (
    <>
      {!logout ? (
        localStorage.getItem("token") ? (
          itemAddView ? (
            // <IonContent>
            //   <IonModal
            //     isOpen={itemAddView}
            //     enterAnimation={enterAnimation}
            //     leaveAnimation={leaveAnimation}
            //   >
            //     <ItemAdd
            //       netStat={networkStatus}
            //       goBack={setItemAddView}
            //       close={setItemAddView}
            //     />
            //   </IonModal>
            // </IonContent>
            <ItemAdd
                  netStat={networkStatus}
                  goBack={setItemAddView}
                  close={setItemAddView}
                />
     
          ) : (
            <IonPage>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>My App</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <CreateAnimation
                  duration={2000}
                  beforeStyles={{
                    opacity: 0.2,
                  }}
                  afterStyles={{
                    background: "rgba(0, 255, 0, 0.5)",
                  }}
                  afterClearStyles={["opacity"]}
                  keyframes={[
                    { offset: 0, transform: "scale(1)" },
                    { offset: 0.5, transform: "scale(1.5)" },
                    { offset: 1, transform: "scale(1)" },
                  ]}
                  iterations={Infinity}
                  play={true}
                >
                  <IonButton
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userId");
                      setLogout(true);
                    }}
                  >
                    Log out
                  </IonButton>
                </CreateAnimation>

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
                <CreateAnimation
                  duration={4000}
                  iterations={Infinity}
                  fromTo={[
                    {
                      property: "transform",
                      fromValue: "translateX(0px)",
                      toValue: "translateX(-100px)",
                    },
                    { property: "opacity", fromValue: "1", toValue: "0.2" },
                  ]}
                  play={true}
                >
                  <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setItemAddView(true)}>
                      <IonIcon icon={add} />
                    </IonFabButton>
                  </IonFab>
                </CreateAnimation>
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
