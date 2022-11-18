import React, { useContext, useState } from "react";
import {
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import { ItemContext } from "../todo/ItemProvider";
import { ItemProps } from "../todo/ItemProps";
import Item from "../todo/Item";

export function SearchBar() {
  const { items } = useContext(ItemContext);
  let [results, setResults] = useState<ItemProps[]>([]);
  const [onlyLanded, setOnlyLanded] = useState(false);

  const handleChange = (ev: Event) => {
    if (items) {
      let query = "";
      const target = ev.target as HTMLIonSearchbarElement;
      if (target) query = target.value!.toLowerCase();
   
        setResults(
          items.filter(
            (d) => query !== "" && d.airlineCode.toLowerCase().startsWith(query)
          )
        );
      
    }
  };

  return (
    <>
     
      <IonSearchbar
        debounce={1000}
        onIonChange={(ev) => handleChange(ev)}
      ></IonSearchbar>

      <IonList>
        {results.map(({ id, airlineCode, estimatedArrival, landed }, index) => (
          <Item
            key={index}
            id={id}
            airlineCode={airlineCode}
            estimatedArrival={estimatedArrival}
            landed={landed}
            onEdit={(id) => id}
          />
        ))}
      </IonList>
    </>
  );
}
