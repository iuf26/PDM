import React, { useCallback, useContext, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { ItemContext } from "../todo/ItemProvider";
import { ItemProps } from "../todo/ItemProps";
import Item from "../todo/Item";
import { Redirect } from "react-router-dom";
export function InfiniteScroll() {
  const { items } = useContext(ItemContext);
  const [data, setData] = useState<ItemProps[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const pushData = useCallback(() => {
    if (items) {
      if (data.length >= items.length) return;
      const max = data.length + 20;
      const min = max - 20;
      const newData = [];
      for (let i = min; i < max; i++) {
        newData.push(items[i]);
      }
      setData([...data, ...newData]);
    }
  }, [items, data]);

  useEffect(() => {
    pushData();
  }, [items]);
  const loadData = (ev: any) => {
    setTimeout(() => {
      pushData();
      ev.target.complete();
      if (data.length === 1000) {
        setInfiniteDisabled(true);
      }
    }, 500);
  };

  return (
    <>
      <IonList>
        {
          <IonList>
            {data.map(
              ({ id, airlineCode, estimatedArrival, landed }, index) => (
                <Item
                  key={index}
                  id={id}
                  airlineCode={airlineCode}
                  estimatedArrival={estimatedArrival}
                  landed={landed}
                  onEdit={(id) => id}
                />
              )
            )}
          </IonList>
        }
      </IonList>

      <IonInfiniteScroll
        onIonInfinite={loadData}
        threshold="100px"
        disabled={isInfiniteDisabled}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more data..."
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
}
