import { API_BASE_URL } from "@/config/enpoints";

interface BlockchainArea {
  id: number;
  name: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
}

interface CreateRegistrationDto {
  full_name: string;
  student_id: string;
  email: string;
  phone_number?: string;
  university: string;
  major: string;
  year_of_study: number;
  division: string;
  blockchain_experience?: string;
  reason: string;
  blockchain_area_ids?: number[];
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data: any;
}

class RegistrationService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAllBlockchainAreas(): Promise<BlockchainArea[]> {
    try {
      const response = await fetch(`${this.baseURL}/blockchain-areas/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlockchainArea[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blockchain areas:', error);
      throw error;
    }
  }

  async createRegistration(
    registrationData: CreateRegistrationDto
  ): Promise<RegistrationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/registrations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: RegistrationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  }
}

export const registrationService = new RegistrationService();
export type { BlockchainArea, CreateRegistrationDto, RegistrationResponse };
