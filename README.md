# LAB1:
###### App will hold a list of flightsArrival elements
###### flight:airlineCode(string) id(numeric) estimatedArrival(date) landed(boolean) 

# Functionalities:
    * View flights list
        -4 columns(id,airlineCode,estimatedArrival,landed)
    * Add a flight
        -using the plus button on the bottom-right corner
        -After clicking the "+" button you'll be redireted to a new page 
        where you can enter the properties of this new flight you wish to add as follows:
        This page contains;
            - an input of type string(label = "AirlineCode")
            -an input of type IonicPicker for the "Landed" label where you can select only true or false
            -an input of type IonicDatePicker where you cand select "Estimated arrival" label value
        -If you wish to add the new flight in list you click on "SAVE" button on the top-right corner of the page
        -after an item is saved you'll be redirected back  to the flights list page
        -you do not need to enter the id when adding a new flight because it will be generated on server side
    * live updates
        -used webSockets 
        -if i have to instances of the client opened and i modify something in one of them
        the changes will be automatically shown on the other client too(thanks to websockets)
    * used redux


LAB2
    Pentru varianta de salvat date offline am folosit Ionic Storage
    Daca se detecteaza ca a fost intrerupta conexiunea de internet atunci modificarile se salveaza in acest Ionic Storage
    Am folosit local storage pentru a salva token-ul care este generat de fiecare data cand un utilizator se autentifica
    Fiecare entitate are un id de utilizator ,se face o filtrare dupa acest id pentru fiecare utilizator
    pentru a se asigura faptul ca pentru un anumit utilizator sunt afisate doar datele care il privesc pe cel in cauza
    Pentru paginare am folosit infinite scrolling din Ionic
