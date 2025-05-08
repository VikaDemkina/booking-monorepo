// Общие типы для проекта

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface Metrics {
  buildTime: number;
  deployTime: number;
  commitToDeployTime: number;
}