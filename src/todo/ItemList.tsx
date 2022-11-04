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

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { userId } = useContext(AppContext);
  const [logout, setLogout] = useState(false);
  useEffect(() => {
    console.log(logout);
  }, [logout]);
 
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
                <IonButton>Network status:</IonButton>
              <IonLoading isOpen={fetching} message="Fetching items" />
              {/* {items && (
              <IonList>
              {items.map(({ id, airlineCode,estimatedArrival,landed}) =>
              <Item key={id} id={id} airlineCode={airlineCode} estimatedArrival = {estimatedArrival} landed = {landed} onEdit={id => history.push(`/item/${id?.toString()}`)} />)}
              </IonList>
            )} */}
              <SearchBar />

              <br></br>
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
          <div>Retrieving items...</div>
        )
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default ItemList;
