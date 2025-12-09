import { PrismaClient } from '@/generated/prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { prisma } from '../prisma';
import { beforeEach, vi } from 'vitest';

vi.mock('../prisma', () => ({
	__esModule: true,
	prisma: mockDeep<PrismaClient>(),
}));

// Helper to access the mock with typing
// dummy edit
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
	mockReset(prismaMock);
});
