import { Station } from '../types';

export const stations: Station[] = [
  {
    id: 'st-001',
    name: 'North Field',
    city: 'Bandung',
    temp: 27.5,
    humidity: 68,
    lastSeen: '2025-08-19T14:00:00Z',
    status: 'active',
  },
  {
    id: 'st-002',
    name: 'South Orchard',
    city: 'Yogyakarta',
    temp: 29.1,
    humidity: 72,
    lastSeen: '2025-08-19T13:45:00Z',
    status: 'active',
  },
  {
    id: 'st-003',
    name: 'West Plot',
    city: 'Semarang',
    temp: null,
    humidity: null,
    lastSeen: '2025-08-18T10:00:00Z',
    status: 'inactive',
  },
];
