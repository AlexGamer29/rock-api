import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerService } from './crawler/crawler.service';

describe('AppController', () => {
  let app: TestingModule;
  const getRawMusicMock = jest.fn();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: CrawlerService,
          useValue: {
            getRawMusic: getRawMusicMock,
          },
        },
        {
          provide: 'RAW_MUSIC_IDS',
          useValue: ['5'],
        },
      ],
    }).compile();
  });

  describe('getHello', () => {
    it('should delegate to crawler service with injected ids', () => {
      getRawMusicMock.mockReturnValue('mocked-result');
      const appController = app.get(AppController);
      const result = appController.getHello();
      expect(result).toBe('mocked-result');
      expect(getRawMusicMock).toHaveBeenCalledWith(['5']);
    });
  });
});
