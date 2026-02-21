export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  enabled: boolean;
  type: 'car' | 'motorcycle';
  color?: string;
  iconColor?: string;
  iconBackground?: string;
}
