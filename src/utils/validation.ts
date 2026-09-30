import * as z from 'zod';

export const rfqSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required (min 2 characters)' }),
  contactPerson: z.string().min(2, { message: 'Representative name is required' }),
  email: z.string().email({ message: 'Valid corporate email is required' }),
  phoneCountryCode: z.string().min(2, { message: 'Country prefix is required' }),
  phoneNumber: z.string().min(6, { message: 'Phone number is required' }),
  country: z.string().min(2, { message: 'Destination country is required' }),
  destinationPort: z.string().min(2, { message: 'Discharge port (POD) is required' }),
  transportType: z.enum(['container_40hc', 'mega_truck_136']),
  incoterm: z.enum(['FOB', 'CIF', 'CFR', 'DAP']),
  volumeContainers: z.number().min(1, { message: 'Minimum 1 container / truck is required' }),
  approxVolumeM3: z.number().min(1),
  grade: z.enum(['EN1611_CLASS_A', 'EN1611_CLASS_AB', 'EN1611_CLASS_BC']),
  thickness: z.number().min(10),
  width: z.number().min(50),
  length: z.number().min(1),
  moisture: z.enum(['kd_18', 'fresh_cut']),
  treatments: z.array(z.string()),
  specialRequirements: z.string().optional(),
  currency: z.enum(['EUR', 'USD']),
  deliveryTimeline: z.string(),
});

export type FormValues = z.infer<typeof rfqSchema>;
