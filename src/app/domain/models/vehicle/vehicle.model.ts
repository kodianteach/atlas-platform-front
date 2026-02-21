/**
 * Vehicle models
 */

export type VehicleType = 'car' | 'motorcycle';

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  enabled: boolean;
  type: VehicleType;
  color?: string;
  iconColor?: string;
  iconBackground?: string;
}
