import { Booking } from '@/types';

const MOCK_USER_ID = 'user_123_abc';

export const mockUserBookings: Booking[] = [
  {
    id: 'BKNG-001',
    userId: MOCK_USER_ID,
    carId: 1,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 11592,
    status: 'Completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'BKNG-002',
    userId: MOCK_USER_ID,
    carId: 4,
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 23136,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'BKNG-003',
    userId: MOCK_USER_ID,
    carId: 2,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 10128,
    status: 'Ongoing',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'BKNG-004',
    userId: 'another_user_456',
    carId: 1,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  },
    {
    id: 'BKNG-005',
    userId: MOCK_USER_ID,
    carId: 13,
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Cancelled',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];