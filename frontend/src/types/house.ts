export interface House {
  id: number;
  title: string;
  image: string;
  address: string;
  salePrice: number;
  houseStyle:
    | "1Story"
    | "1.5Fin"
    | "1.5Unf"
    | "2Story"
    | "2.5Fin"
    | "2.5Unf"
    | "SFoyer"
    | "SLvl"
    | null;
  firePlaces: number;

  garageCars: number;
  garageCond: string;

  yearBuilt: number;

  kitchenAbvGr: number;
  bedRoomAbvGr: number;
  fullBath: number;

  lotArea: number;

  /**
       AllPub	All public Utilities (E,G,W,& S)	
       NoSewr	Electricity, Gas, and Water (Septic Tank)
       NoSeWa	Electricity and Gas Only
       ELO	Electricity only	
*/
  utilities: "AllPub" | "NoSewr" | "NoSeWa" | "ELO";
}
