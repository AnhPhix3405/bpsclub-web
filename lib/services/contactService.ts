import { API_BASE_URL } from '@/config/enpoints';

// Types
export interface ContactFormData {
  full_name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Contact extends ContactFormData {
  id: number;
  created_at: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: Contact;
  error?: string;
}

// API Service
export const contactService = {
  // Submit contact form (public endpoint)
  async submitContact(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Contact message sent successfully',
        data: data.data,
      };
    } catch (error) {
      console.error('Error submitting contact:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get all contacts (admin endpoint - requires auth)
  async getAllContacts(authToken: string): Promise<Contact[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get contact by ID (admin endpoint - requires auth)
  async getContactById(id: number, authToken: string): Promise<Contact | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },

  // Delete contact (admin endpoint - requires auth)
  async deleteContact(id: number, authToken: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Contact deleted successfully',
      };
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete contact',
      };
    }
  },
};

// Utility functions
export const contactUtils = {
  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate form data
  validateContactForm(formData: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.full_name.trim()) {
      errors.push('Full name is required');
    } else if (formData.full_name.length > 150) {
      errors.push('Full name must be less than 150 characters');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    } else if (formData.email.length > 150) {
      errors.push('Email must be less than 150 characters');
    }

    if (!formData.subject.trim()) {
      errors.push('Subject is required');
    } else if (formData.subject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }

    if (!formData.message.trim()) {
      errors.push('Message is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Format contact data for display
  formatContactForDisplay(contact: Contact): {
    formattedDate: string;
    shortMessage: string;
    displayName: string;
  } {
    const date = new Date(contact.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const shortMessage = contact.message.length > 100 
      ? contact.message.substring(0, 100) + '...'
      : contact.message;

    const displayName = contact.full_name.length > 20
      ? contact.full_name.substring(0, 20) + '...'
      : contact.full_name;

    return {
      formattedDate,
      shortMessage,
      displayName,
    };
  },

  // Clean form data
  sanitizeFormData(formData: ContactFormData): ContactFormData {
    return {
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };
  },
};
