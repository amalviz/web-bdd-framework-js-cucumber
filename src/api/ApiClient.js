import axios from 'axios';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class ApiClient {
  constructor(baseUrl = config.apiBaseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      validateStatus: () => true,
    });
  }

  async get(path, options = {}) {
    logger.info(`GET ${path}`);
    return this.client.get(path, options);
  }

  async post(path, data, options = {}) {
    logger.info(`POST ${path}`);
    return this.client.post(path, data, options);
  }

  async put(path, data, options = {}) {
    logger.info(`PUT ${path}`);
    return this.client.put(path, data, options);
  }

  async patch(path, data, options = {}) {
    logger.info(`PATCH ${path}`);
    return this.client.patch(path, data, options);
  }

  async delete(path, options = {}) {
    logger.info(`DELETE ${path}`);
    return this.client.delete(path, options);
  }

  setAuthToken(token) {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  setHeader(name, value) {
    this.client.defaults.headers.common[name] = value;
  }
}
