export interface ItemProps {
  id: number;
  airlineCode: string;
  landed: boolean;
  estimatedArrival: Date;
  userId?: number;
  imgSrc?:string
}
