import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PaymongoService {
  private readonly baseUrl = 'https://api.paymongo.com/v1';

  constructor() {}

  async createPaymentLink(amount: number, description: string) {
    const url = `${this.baseUrl}/links`;
    const data = {
      data: {
        attributes: {
          amount: amount,
          description: description,
        }
      }
    };


    const secretKey = 'sk_test_MZqV59A1Yfp3ydheqUHZaB6R';
    const headers = {
      'Authorization': `Basic ${btoa(secretKey + ':')}`, 
      'Content-Type': 'application/json'
    };
    
    

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:');
      throw error;
    }
  }


  async getLinkById(id: string) {
    const url = `${this.baseUrl}/links/${id}`;
    
    const secretKey = 'sk_test_MZqV59A1Yfp3ydheqUHZaB6R';
    const headers = {
      'Authorization': `Basic ${btoa(secretKey + ':')}`, 
      'Accept': 'application/json'
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.log('Not paid by Paymongo');
      throw error;
    }
  }
}