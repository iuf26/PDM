import React, { useCallback } from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { ItemProps } from "./ItemProps";
import { DateTime } from "luxon";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: number) => void;
}

const Item: React.FC<ItemPropsExt> = ({
  id,
  airlineCode,
  estimatedArrival,
  landed,
  onEdit,
}) => {
  console.log(landed);
  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
  return (
    <IonItem onClick={handleEdit}>
      <IonLabel>{id.toString()}</IonLabel>
      <IonLabel>{airlineCode}</IonLabel>
      <IonLabel>
        {DateTime.fromISO(
          new Date(estimatedArrival).toISOString()
        ).toLocaleString(DateTime.DATETIME_MED)}
      </IonLabel>
      <IonLabel>{landed.toString()}</IonLabel>
    </IonItem>
  );
};


export default Item;
