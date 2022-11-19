import { useEffect, useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';


interface MyLocation {
  position?: Position;
  error?: Error;
}

export const useMyLocation = () => {
  const [state, setState] = useState<MyLocation>({});
  useEffect(watchMyLocation, []);
  return state;

  function watchMyLocation() {
    let cancelled = false;
    Geolocation.getCurrentPosition()
      .then(position => updateMyPosition('current', position))
      .catch(error => updateMyPosition('current',undefined, error));
    const callbackId = Geolocation.watchPosition({}, (position, error) => {
        if(position)
      updateMyPosition('watch', position, error);
    });
    callbackId.then(resp => {
         return () => {
      cancelled = true;
      Geolocation.clearWatch({ id:resp });
    };
    })
   

    function updateMyPosition(source: string, position?: Position, error: any = undefined) {
      console.log(source, position, error);
      if (!cancelled) {
        setState({ ...state, position: position || state.position, error });
      }
    }
  }
};
