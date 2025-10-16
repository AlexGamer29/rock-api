import { Inject, Injectable } from '@nestjs/common';
import { CrawlerService } from './crawler/crawler.service';

@Injectable()
export class AppService {
  constructor(
    private readonly crawlerService: CrawlerService,
    @Inject('RAW_MUSIC_IDS') private readonly rawMusicIds: string[],
  ) {}

  public getHello(): any {
    return this.crawlerService.getRawMusic(this.rawMusicIds);
  }
}
