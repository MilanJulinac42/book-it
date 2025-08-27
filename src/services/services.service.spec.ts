import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    service: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of services with booking counts', async () => {
      const mockServices = [
        {
          id: 'service-id-1',
          title: 'Group Session',
          start_time: new Date(),
          end_time: new Date(),
          capacity: 10,
          is_group: true,
          price_points: 20,
          bookings: [{ id: 'booking-id-1' }, { id: 'booking-id-2' }],
        },
        {
          id: 'service-id-2',
          title: 'Personal Training',
          start_time: new Date(),
          end_time: new Date(),
          capacity: 1,
          is_group: false,
          price_points: 50,
          bookings: [{ id: 'booking-id-3' }],
        },
      ];

      mockPrismaService.service.findMany.mockResolvedValue(mockServices);

      const result = await service.findAll();

      expect(prisma.service.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          start_time: true,
          end_time: true,
          capacity: true,
          is_group: true,
          price_points: true,
          bookings: {
            select: {
              id: true,
            },
          },
        },
      });

      expect(result).toEqual(mockServices);
      expect(result.length).toBe(2);
      expect(result[0].bookings.length).toBe(2);
      expect(result[1].bookings.length).toBe(1);
    });
  });
});
