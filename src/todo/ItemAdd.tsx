import React, {useCallback, useContext, useState } from "react";
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
  IonAlert,
} from "@ionic/react";
import { ItemContext } from "./ItemProvider";
import { ItemProps } from "./ItemProps";
import {Preferences} from '@capacitor/preferences'
interface AddItemProps {
  netStat: boolean;
  goBack(v: boolean): any;
}
export const ItemAdd: React.FunctionComponent<AddItemProps> = ({
  netStat,
  goBack,
}) => {
  const { items, saveItem } = useContext(ItemContext);
  const [airlineCode, setAirlineCode] = useState("");
  const [landed, setLanded] = useState(false);
  const [id, setId] = useState(-1);
  const [eta, setEta] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const setItemOffline = async (value: string) => {
    await Preferences.set({
      key: "add",
      value,
    });
  };
  const getAddData = async () => {
    let res = (await Preferences.get({ key: "add" })).value;
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
    if (netStat) {
      console.log("in here");
      saveItem && saveItem(item);
    } else {
      console.log("do an offline saving...");
      let res = await getAddData();

      if (res) {
        res.push(item);
      } else {
        res = [];
        res.push(item);
      }
      const dd = items;
      if(dd){
      dd.unshift(item)}
      await setItemOffline(JSON.stringify(dd));
      alert("Your data won't be sended to the server ,you are in offline mode")
    }
    goBack(false);
    //
  }, [saveItem, airlineCode, landed, eta, id]);

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
        <IonButton>Network status:{netStat ? "online" : "offline"}</IonButton>
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
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Alert"
          subHeader="Important message"
          message="This is an alert!"
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};
