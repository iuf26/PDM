import { Directory, Filesystem } from "@capacitor/filesystem";
import { IonImg } from "@ionic/react";
import React, { useEffect, useState } from "react";

export function ItemPicture({ src }: any) {
  const [imgRealSource, setImgRealSource] = useState(src);
  
  useEffect(() => {
    
    if (src) {
     
      const loadSaved = async () => {
        const file = await Filesystem.readFile({
          path: src, //TODO check here
          directory: Directory.Data,
        });
        // Web platform only: Load the photo as base64 data
        let res = `data:image/jpeg;base64,${file.data}`;
        setImgRealSource(res);
      };
      loadSaved();
    }
  }, []);
  return  <IonImg src={imgRealSource} /> ;
}
