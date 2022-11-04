import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext({userId:-1,setUserId:(ex:number) => console.log("start")});

export function AppContextProvider(props:any){
    const [userId,setUserId] = useState(-1);

    return (
        <AppContext.Provider
            value={{ userId,setUserId }}
            {...props}
        />
    );

}



