import React, { useState } from "react";
import { camera, trash, close } from "ionicons/icons";
import { IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { usePhotoGallery, UserPhoto } from "../hooks/usePhotoGallery";

export const PhotoCapturer:React.FC = () => {
  const { takePhoto } = usePhotoGallery();

  return (
    <>
      <IonContent>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </>
  );
}
