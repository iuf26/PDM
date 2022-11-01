import React, { useContext, useState } from "react";
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

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const [logout, setLogout] = useState(false);
  log("render");
  return (
    <>
      {!logout ? (
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

                setLogout(true);
              }}
            >
              Log out
            </IonButton>

            <IonLoading isOpen={fetching} message="Fetching items" />
            {/* {items && (
          <IonList>
            {items.map(({ id, airlineCode,estimatedArrival,landed}) =>
              <Item key={id} id={id} airlineCode={airlineCode} estimatedArrival = {estimatedArrival} landed = {landed} onEdit={id => history.push(`/item/${id?.toString()}`)} />)}
          </IonList>
        )} */}
            <InfiniteScroll />
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
        <Redirect to="/login" />
      )}
    </>
  );
};

export default ItemList;
