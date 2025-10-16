import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [PrismaModule, CrawlerModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'RAW_MUSIC_IDS',
      useFactory: () => {
        const ids =
          process.env.RAW_MUSIC_IDS ??
          process.env.RAW_MUSIC_ID ??
          process.env.DEFAULT_RAW_MUSIC_ID ??
          '5';

        return ids
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
      },
    },
  ],
})
export class AppModule {}
