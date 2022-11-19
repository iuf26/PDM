import { useState, useEffect } from "react";
import { isPlatform } from "@ionic/react";
//import { Camera, CameraResultType, CameraSource } from '@capacitor/core';
import { Plugin } from "@capacitor/core";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Preferences } from "@capacitor/preferences";
import { Directory, Filesystem } from "@capacitor/filesystem";

export interface UserPhoto {
  filepath?: string;
  webviewPath?: string;
  filename: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("method did not return a string");
      }
    };
    reader.readAsDataURL(blob);
  });
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    console.log(photo.webPath);
    const fileName = new Date().getTime() + ".jpeg";
    let oldPhotos =   (await Preferences.get({ key: "userPhotos" })).value;
    let  oldObj;
    if (oldPhotos) {
       oldObj  = JSON.parse(oldPhotos);
     
    }
    const newPhotos = [
      {
        filename: fileName,
        webviewPath: photo.webPath,
      },
      ...oldObj,
    ];
    savePicture(photo, fileName);
    Preferences.set({
      key: "userPhotos",
      value: JSON.stringify(newPhotos),
    });
    setPhotos(newPhotos);
  };

  const savePicture = async (photo: Photo, fileName: string) => {
    const base64Data = await base64FromPath(photo.webPath!);
    console.log(Directory.Library);
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
  };
  return {
    takePhoto,
    photos,
  };
}
