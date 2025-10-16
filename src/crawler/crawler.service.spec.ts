import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerService } from './crawler.service';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';

describe('CrawlerService', () => {
  let service: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CrawlerService,
        {
          provide: ProxyService,
          useValue: {
            getNextProxyConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
