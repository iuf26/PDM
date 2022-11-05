import React, { useCallback, useContext, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonPicker,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { ItemContext } from "./ItemProvider";
import { ItemProps } from "./ItemProps";
import { Plugins } from "@capacitor/core";
const { Network } = Plugins;
const { Storage } = Plugins;

export const ItemAdd: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, saveItem } = useContext(ItemContext);
  const [airlineCode, setAirlineCode] = useState("");
  const [landed, setLanded] = useState(false);
  const [id, setId] = useState(-1);
  const [eta, setEta] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  const setItemOffline = async (value: string) => {
    await Storage.set({
      key: "add",
      value,
    });
  };
  const getAddData = async () => {
    let res = (await Storage.get({ key: "add" })).value;
    if (res) {
      return JSON.parse(res);
    }
    return res;
  };
  const handleSave = useCallback(async () => {
   
    const item: ItemProps = {
      id,
      landed,
      estimatedArrival: eta,
      airlineCode,
    };
    if (networkStatus) {
      
      saveItem && saveItem(item).then(() => history.push("/items"));
    } else {
      console.log("do an offline saving...");
      let res = await getAddData();

      if (res) {
        res.push(item);
        console.log(res);
        setItemOffline(JSON.stringify(res)).then(() => history.push("/items"));
      }
    }
  }, [saveItem, airlineCode, history, landed, eta, id]);
  Network.addListener("networkStatusChange", (status) => {
    console.log("Network status changed in addd item", status);

    setNetworkStatus(status.connected);
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add item</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput onIonChange={(e) => setAirlineCode(e.detail.value || "")}>
          AirlineCode:
        </IonInput>

        <IonItem>
          <IonLabel
            onClick={() => {
              setIsPickerOpen(true);
            }}
          >
            Landed
          </IonLabel>
          <IonPicker
            columns={[
              {
                name: "landed",
                options: [
                  {
                    text: "True",
                    value: true,
                  },
                  {
                    text: "False",
                    value: null,
                  },
                ],
              },
            ]}
            isOpen={isPickerOpen}
            buttons={[
              {
                text: "Confirm",
                handler: (value) => {
                  setIsPickerOpen(false);
                  if (value.landed.value) {
                    setLanded(true);
                  } else {
                    setLanded(false);
                  }
                },
              },
            ]}
          ></IonPicker>
        </IonItem>

        <IonItem>
          <IonLabel>Estimated arrival</IonLabel>
          <IonDatetime
            pickerOptions={{
              buttons: [
                {
                  text: "Save",
                  handler: (value) => {
                    let date = new Date(
                      value.year.value,
                      value.month.value,
                      value.day.value
                    );
                    setEta(date);
                  },
                },
              ],
            }}
          ></IonDatetime>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};
