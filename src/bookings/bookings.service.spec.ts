import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User, Service } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockUser: User = {
    id: 'user-id-1',
    email: 'test@test.com',
    password_hash: 'hashed_password',
    points_balance: 100,
  };

  const mockService: Service & { bookings: any[] } = {
    id: 'service-id-1',
    title: 'test service',
    start_time: new Date(),
    end_time: new Date(),
    capacity: 1,
    is_group: false,
    price_points: 50,
    bookings: [],
  };

  describe('createBooking', () => {
    it('should successfully create a booking when conditions are met', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrismaService.service.findUnique.mockResolvedValueOnce({
        ...mockService,
        bookings: [],
      });
      mockPrismaService.$transaction.mockImplementationOnce(
        async (callback) => {
          const result = await callback(mockPrismaService);
          return { id: 'booking-id-1', ...result };
        },
      );

      mockPrismaService.booking.create.mockResolvedValueOnce({
        id: 'booking-id-1',
        user: mockUser,
        service: mockService,
        user_id: mockUser.id,
        service_id: mockService.id,
        idempotency_key: 'test-key-1',
      });

      const result = await service.createBooking(
        { service_id: mockService.id, idempotency_key: 'test-key-1' },
        mockUser,
      );

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { points_balance: { decrement: mockService.price_points } },
      });
      expect(result.booking).toBeDefined();
      expect(result.whatsappPayload).toBeDefined();
    });

    it('should throw ForbiddenException if user has insufficient points', async () => {
      const lowPointsUser = { ...mockUser, points_balance: 40 };
      mockPrismaService.user.findUnique.mockResolvedValueOnce(lowPointsUser);
      mockPrismaService.service.findUnique.mockResolvedValueOnce(mockService);

      await expect(
        service.createBooking(
          { service_id: mockService.id, idempotency_key: 'test-key-2' },
          lowPointsUser,
        ),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if individual service is already booked', async () => {
      const bookedService = {
        ...mockService,
        bookings: [{ id: 'existing-booking-id' }],
      };
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrismaService.service.findUnique.mockResolvedValueOnce(bookedService);

      await expect(
        service.createBooking(
          { service_id: mockService.id, idempotency_key: 'test-key-3' },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
