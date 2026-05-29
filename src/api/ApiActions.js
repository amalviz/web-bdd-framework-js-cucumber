import { ApiClient } from './ApiClient.js';

/**
 * Reusable API actions — mirror WebActions pattern for HTTP operations.
 */
export class ApiActions {
  constructor(apiClient = new ApiClient()) {
    this.client = apiClient;
    this.lastResponse = null;
  }

  async getUsers() {
    this.lastResponse = await this.client.get('/users');
    return this.lastResponse;
  }

  async getUserById(id) {
    this.lastResponse = await this.client.get(`/users/${id}`);
    return this.lastResponse;
  }

  async createUser(userData) {
    this.lastResponse = await this.client.post('/users', userData);
    return this.lastResponse;
  }

  async updateUser(id, userData) {
    this.lastResponse = await this.client.put(`/users/${id}`, userData);
    return this.lastResponse;
  }

  async deleteUser(id) {
    this.lastResponse = await this.client.delete(`/users/${id}`);
    return this.lastResponse;
  }

  getStatusCode() {
    return this.lastResponse?.status;
  }

  getResponseBody() {
    return this.lastResponse?.data;
  }

  getResponseHeader(name) {
    return this.lastResponse?.headers?.[name.toLowerCase()];
  }
}
