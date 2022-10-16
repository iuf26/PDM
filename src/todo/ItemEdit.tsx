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
  const handleSave = useCallback(() => {
    const editedItem = item ? { ...item, airlineCode } : null;
    if (editedItem) {
      saveItem && saveItem(editedItem).then(() => history.goBack());
    }
  }, [item, saveItem, airlineCode, history]);
  log("render");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          value={airlineCode}
          onIonChange={(e) => setAirlineCode(e.detail.value || "")}
        />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || "Failed to save item"}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
