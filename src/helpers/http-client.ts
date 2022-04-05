import axios from 'axios';
import * as axiosRetry from 'axios-retry';
(<any>axiosRetry)(axios, { retries: 3 });

export type HttpHeader = { [key: string]: string };

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HttpClientRegistryKey = 'report' | 'auth' | 'worker' | 'FacebookGraph' | 'Google';

export class HttpClient {
  private baseURL: string;
  private headers: HttpHeader;
  private timeout: number;

  constructor(baseURL: string, headers: HttpHeader = {}, timeout = 1000) {
    this.baseURL = baseURL;
    this.headers = headers;
    this.timeout = timeout;
  }

  private async makeRequest(
    method: HttpMethod,
    path: string,
    data?: { [key: string]: any },
    headers?: HttpHeader
  ): Promise<any> {
    const config: any = {
      baseURL: this.baseURL,
      headers: this.headers,
      method,
      url: path,
      timeout: this.timeout
    };

    if (method !== 'GET') config.data = data;
    if (headers) config.headers = { ...config.headers, ...headers };


    const response = await axios(config);

    return response.data;
  }

  async get(path: string, headers: HttpHeader = {}): Promise<any> {
    return this.makeRequest('GET', path, null, headers);
  }

  async post(path: string, data: any, headers: HttpHeader = {}): Promise<any> {
    return this.makeRequest('POST', path, data, headers);
  }

  async put(path: string, data: any, headers: HttpHeader = {}): Promise<any> {
    return this.makeRequest('PUT', path, data, headers);
  }

  async delete(path: string, data: any, headers: HttpHeader = {}): Promise<any> {
    return this.makeRequest('DELETE', path, data, headers);
  }
}
