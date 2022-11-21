import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonPicker,
  IonTitle,
  IonToolbar,
  IonAlert,
} from "@ionic/react";
import { ItemContext } from "./ItemProvider";
import { ItemProps } from "./ItemProps";
import { Preferences } from "@capacitor/preferences";
import { useMyLocation } from "../hooks/useMyLocation";
import { MyMap } from "../components/MyMap";
import { ItemPicture } from "./ItemPicture";
import { PhotoGallery } from "../components/PhotoGallery";
interface AddItemProps {
  netStat: boolean;
  goBack(v: boolean): any;
  close:any;
}
export const ItemAdd: React.FunctionComponent<AddItemProps> = ({
  netStat,
  goBack,
 close
}) => {
  const { items, saveItem } = useContext(ItemContext);
  const [airlineCode, setAirlineCode] = useState("");
  const [landed, setLanded] = useState(false);
  const [id, setId] = useState(-1);
  const [eta, setEta] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  //const myLocation = useMyLocation();
  //const { latitude: lat, longitude: lng } = myLocation.position?.coords || {};
  const [latit, setLatit] = useState<number>(46.74355462141843);
  const [longi, setLongi] = useState<number>(23.593913928950283);
  const[imgSource,setImgSource] = useState()
  const [openGallery, setOpenGallery] = useState(false);
  

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
    const item: ItemProps = {
      id,
      landed,
      estimatedArrival: eta,
      airlineCode,
      latitude:latit,
      longitude:longi,
      imgSrc:imgSource
    };
    console.log(item);
    if (netStat) {
      console.log("in here");
      saveItem && saveItem(item);
    } else {
      console.log("do an offline saving...");
      let res = await getAddData();

      if (res) {
        res.push(item);
      } else {
        res = [];
        res.push(item);
      }
      const dd = items;
      if (dd) {
        dd.unshift(item);
      }
      await setItemOffline(JSON.stringify(dd));
      alert("Your data won't be sended to the server ,you are in offline mode");
    }
    goBack(false);
    //
  }, [saveItem, airlineCode, landed, eta, id,imgSource,goBack, items, latit, longi]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add item</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
            <IonButton onClick={() => close(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton>Network status:{netStat ? "online" : "offline"}</IonButton>
        {latit && longi ? (
          <MyMap
            lat={latit}
            lng={longi}
            onMapClick={(lat: number, lng: number) => {
              setLatit(lat);
              setLongi(lng);
            }}
            onMarkerClick={() => 3}
          />
        ) : null}

        <IonInput onIonChange={(e) => setAirlineCode(e.detail.value || "")}>
          AirlineCode:
        </IonInput>

        <IonItem>
          <IonLabel
            onClick={() => {
              setIsPickerOpen(true);
            }}
          >
            Landed
          </IonLabel>
          <IonPicker
            columns={[
              {
                name: "landed",
                options: [
                  {
                    text: "True",
                    value: true,
                  },
                  {
                    text: "False",
                    value: null,
                  },
                ],
              },
            ]}
            isOpen={isPickerOpen}
            buttons={[
              {
                text: "Confirm",
                handler: (value) => {
                  setIsPickerOpen(false);
                  if (value.landed.value) {
                    setLanded(true);
                  } else {
                    setLanded(false);
                  }
                },
              },
            ]}
          ></IonPicker>
        </IonItem>

        <IonItem>
          <IonLabel>Estimated arrival</IonLabel>
          <IonDatetime
            pickerOptions={{
              buttons: [
                {
                  text: "Save",
                  handler: (value) => {
                    let date = new Date(
                      value.year.value,
                      value.month.value,
                      value.day.value
                    );
                    setEta(date);
                  },
                },
              ],
            }}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          {imgSource !== "" ? <ItemPicture src={imgSource} /> : <div>No image to display</div>}
          <IonButton onClick={() => setOpenGallery(true)}>
              Upload Photo
            </IonButton>

            {openGallery ? <PhotoGallery close={setOpenGallery} setPhoto={setImgSource} /> : null}

        </IonItem>
         <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Alert"
          subHeader="Important message"
          message="This is an alert!"
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};
