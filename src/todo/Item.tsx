import React, { useCallback, useEffect, useState } from "react";
import { IonImg, IonItem, IonLabel } from "@ionic/react";
import { ItemProps } from "./ItemProps";
import { DateTime } from "luxon";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { base64FromPath } from "../hooks/usePhotoGallery";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: number) => void;
}

const Item: React.FC<ItemPropsExt> = ({
  id,
  airlineCode,
  estimatedArrival,
  landed,
  imgSrc,
  onEdit,
}) => {
  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
  const [imgRealSource, setImgRealSource] = useState("");
  useEffect(() => {
    if (imgSrc) {
      const loadSaved = async () => {
        const file = await Filesystem.readFile({
          path: imgSrc!, //TODO check here
          directory: Directory.Data,
        });
        // Web platform only: Load the photo as base64 data
        let res = `data:image/jpeg;base64,${file.data}`;
        setImgRealSource(res);
      };
      loadSaved();
    }
  }, []);
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
      {imgSrc ? <IonImg src={imgRealSource} /> :<IonImg src={"assets/images/flower.jpg"} />}
    </IonItem>
  );
};

export default Item;
