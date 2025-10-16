import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule],
  providers: [CrawlerService, ProxyService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
