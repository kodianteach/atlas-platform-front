/**
 * Residence info for the authenticated user
 */
export interface MyResidence {
  organizationName: string;
  unitCode: string | null;
  ownershipType: string;
  roleName: string;
}
