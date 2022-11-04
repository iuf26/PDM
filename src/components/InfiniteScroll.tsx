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
  const [firstLoad,setFirstLoad] = useState(true)
  const pushData = () => {
    if (items) {
      
      let max;
      if (data.length >= items.length) return;
      if (data.length + 20 >= items.length) {
        max = items.length;
      } else {
        max = data.length + 20;
      }
      const min = max - 20;
      const newData = [];
      for (let i = min; i < max; i++) {
        newData.push(items[i]);
      }
      setData([...data, ...newData]);
    }}


  useEffect(() => {
    if (items) {
      // console.log("items changed",items[items.length - 1]);
      // if (data.length > 0) {
      //   const elem = items[items.length - 1];
      //   const newData = data;
      //   newData.push(elem);
      //   // for (let i = min; i < max; i++) {
      //   //   newData.push(items[i]);
      //   // }
      //   console.log(newData);
      //   setData(newData);
      // } else {
      if (data.length > 0) {
        let copy = [...data];
        copy.pop();
        let res = [...copy,items[0]];
      
        setData(res);
        return;
      }

      pushData();
    }
  }, [items]);
  const loadData = (ev: any) => {
    
    setTimeout(() => {
      console.log("In set time");
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
