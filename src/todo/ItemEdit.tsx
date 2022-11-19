import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { getLogger } from "../core";
import { ItemContext } from "./ItemProvider";
import { RouteComponentProps } from "react-router";
import { ItemProps } from "./ItemProps";
import {Preferences } from "@capacitor/preferences";
import {PhotoCapturer} from "../components/PhotoCapturer";


const log = getLogger("ItemEdit");

interface ItemEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [airlineCode, setAirlineCode] = useState("");
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log("useEffect");
    const routeId = match.params.id || -1;
    const item = items?.find((it) => it.id === routeId);
    setItem(item);
    if (item) {
      setAirlineCode(item.airlineCode);
    }
  }, [match.params.id, items]);
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
    const routeId = match.params.id || -1;
    const item = items?.find((it) => it.id.toString() === routeId);
    const editedItem = item ? { ...item, airlineCode } : null;
    if (localStorage.getItem("net") === "false") {
      let res = await getAddData();

      if (res) {
        res.push(editedItem);
      } else {
        res = [];
        res.push(editedItem);
      }

      await setItemOffline(JSON.stringify(res));
      alert("Your data won't be sended to the server ,you are in offline mode")
      history.goBack();
      return;
    }

    if (editedItem) {
      saveItem && saveItem(editedItem).then(() => history.goBack());
    }
  }, [item, saveItem, airlineCode, history]);
  log("render");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editare</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          value={airlineCode}
          onIonChange={(e) => {
            setAirlineCode(e.detail.value || "");
          }}
        >
          New Airline Code:
        </IonInput>
        {/* <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || "Failed to save item"}</div>
        )} */}
        <PhotoCapturer/>
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
