export class CreateSalonServiceDto {
  salonId: string;
  name: string;
  price: number;
  duration: number;
  bufferTime: number;
  categoryIds: number[];
}
