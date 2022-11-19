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
  webviewPath: string;
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

  let toSendS = localStorage.getItem("userPhotos");
  let objsPhoto = [];
  if (toSendS) objsPhoto = JSON.parse(toSendS);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    console.log(photo.webPath);
    const fileName = new Date().getTime() + ".jpeg";
    let oldPhotos = localStorage.getItem("userPhotos");
    let oldObj;
    if (oldPhotos) {
      oldObj = JSON.parse(oldPhotos);
    }
    let newPhotos;

    if (oldObj) {
      newPhotos = [
        {
          filename: fileName,
          webviewPath: photo.webPath,
        },
        ...oldObj,
      ];
    } else {
      newPhotos = [
        {
          filename: fileName,
          webviewPath: photo.webPath,
        },
      ];
    }
    savePicture(photo, fileName);

    localStorage.setItem("userPhotos", JSON.stringify(newPhotos));
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
    objsPhoto,
  };
}
