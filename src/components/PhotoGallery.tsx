import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonRow } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { usePhotoGallery, UserPhoto } from "../hooks/usePhotoGallery";

export function PhotoGallery({close,setPhoto}:any) {
  //const { objsPhoto } = usePhotoGallery();

  const [photos,setPhotos] = useState<UserPhoto[]>([])
  useEffect(() => {
    const loadSaved =  async () => {
      const value = localStorage.getItem('userPhotos');
      const photosInPreferences = (value ? JSON.parse(value) : []) as UserPhoto[];
  
      for (let photo of photosInPreferences) {
        const file = await Filesystem.readFile({
          path: photo.filename,
          directory: Directory.Data,
        });
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
      setPhotos(photosInPreferences);
    };
    loadSaved();
  }, []);
  const handleImageClick = (url:string) => {
        localStorage.setItem('selectedImage',url);
        setPhoto(url)
  }
  return (<>
  <IonButton onClick={() => {close(false)}}>Close</IonButton>
    <IonGrid>
      <IonRow>
        {photos.map((photo: UserPhoto, index: any) => (
          <IonCol size="6" key={index}>
            <IonImg src={photo.webviewPath} onClick={() => handleImageClick(photo.filename)}/>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
    </>
  );
}
