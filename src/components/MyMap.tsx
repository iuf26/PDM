import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { compose, withProps } from "recompose";
import { mapsApiKey } from "./credentials.js";

interface MyMapProps {
  lat?: number;
  lng?: number;
  onMapClick: (p1: any,p2:any) => void;
  onMarkerClick: (e: any) => void;
}

export const MyMap = compose<MyMapProps, any>(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      onClick={(r) => {
        props.onMapClick(r.latLng.lat(),r.latLng.lng());
      }}
    >
      <Marker
        position={{ lat: props.lat, lng: props.lng }}
        onClick={() => {
          console.log("helo**marker*");
        }}
      />
    </GoogleMap>
  );
});
