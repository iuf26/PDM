import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { getLogger } from "../core";
import { ItemContext } from "./ItemProvider";
import { RouteComponentProps } from "react-router";
import { ItemProps } from "./ItemProps";
import { Preferences } from "@capacitor/preferences";
import { PhotoCapturer } from "../components/PhotoCapturer";
import { PhotoGallery } from "../components/PhotoGallery";
import { UserPhoto } from "../hooks/usePhotoGallery";
import Item from "./Item";
import { ItemPicture } from "./ItemPicture";
import { useMyLocation } from "../hooks/useMyLocation";
import { MyMap } from "../components/MyMap";

const log = getLogger("ItemEdit");

interface ItemEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saveItem } = useContext(ItemContext);
  const [airlineCode, setAirlineCode] = useState("");

  const [openGallery, setOpenGallery] = useState(false);
  const [imgSource, setImgSource] = useState("");
  const myLocation = useMyLocation();
  const { latitude: lat, longitude: lng } = myLocation.position?.coords || {};
  const [latit, setLatit] = useState<number>();
  const [longi, setLongi] = useState<number>();

  useEffect(() => {
    if (lat) setLatit(lat);
  }, [lat]);

  useEffect(() => {
    if (lng) setLongi(lng);
  }, [lng]);

  useEffect(() => {
    log("useEffect");
    const routeId = match.params.id || -1;
    const item = items?.find((it) => it.id.toString() === routeId.toString());

    if (item) {
      setAirlineCode(item.airlineCode);
      if (item.imgSrc) setImgSource(item.imgSrc.toString());
    }
  }, [match.params.id, items]);
  const setItemOffline = async (value: string) => {
    await Preferences.set({
      key: "add",
      value,
    });
  };
  const getAddData = async () => {
    let res = (await Preferences.get({ key: "add" })).value;
    if (res) {
      return JSON.parse(res);
    }
    return res;
  };
  const handleSave = useCallback(async () => {
    const routeId = match.params.id || -1;
    const item = items?.find((it) => it.id.toString() === routeId);
    let imgSrc = imgSource;

    let editedItem = item ? { ...item, airlineCode, imgSrc } : null;

    if (localStorage.getItem("net") === "false") {
      let res = await getAddData();

      if (res) {
        res.push(editedItem);
      } else {
        res = [];
        res.push(editedItem);
      }

      await setItemOffline(JSON.stringify(res));
      alert("Your data won't be sended to the server ,you are in offline mode");
      history.goBack();
      return;
    }

    if (editedItem) {
      saveItem && saveItem(editedItem).then(() => history.goBack());
    }
  }, [saveItem, airlineCode, history, items, match.params.id, imgSource]);

  log("render");
  return (
    <>
      {openGallery ? (
        <PhotoGallery close={setOpenGallery} setPhoto={setImgSource} />
      ) : (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editare</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleSave}>Save</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {latit && longi ? (
              <MyMap
                lat={latit}
                lng={longi}
                onMapClick={(lat: number, lng: number) => {
                  setLatit(lat);
                  setLongi(lng);
                }}
                onMarkerClick={log("onMarker")}
              />
            ) : null}
            <IonInput
              value={airlineCode}
              onIonChange={(e) => {
                setAirlineCode(e.detail.value || "");
              }}
            >
              New Airline Code:
            </IonInput>
            <IonLabel>Current Photo: </IonLabel>
            {imgSource !== "" ? <ItemPicture src={imgSource} /> : null}
            <IonButton onClick={() => setOpenGallery(true)}>
              Upload Photo
            </IonButton>
            <PhotoCapturer />
          </IonContent>
        </IonPage>
      )}
    </>
  );
};

export default ItemEdit;
