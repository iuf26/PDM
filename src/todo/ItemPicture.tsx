import { Directory, Filesystem } from "@capacitor/filesystem";
import { IonImg } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { CreateAnimation, Animation } from "@ionic/react";

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
  return (
    <CreateAnimation
      duration={1000}
      easing="ease-in-out"
      keyframes={[
        { offset: 0, transform: "scale(1)", opacity: "1" },
        { offset: 1, transform: "scale(1.5)", opacity: "0.5" },
      ]}
      direction="alternate"
      iterations={Infinity}
      play={true}
    >
      <IonImg src={imgRealSource} />
    </CreateAnimation>
   
  );
}
