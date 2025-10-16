import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { AxiosRequestConfig } from 'axios';
import { ProxyService } from './proxy.service';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly proxyService: ProxyService,
  ) {}

  public getRawMusic(ids: string[]): Observable<any> {
    const payload = {
      query: `
        query Songs($ids: [String!]!) {
          songs(ids: $ids) {
            songId
            songName
            nameForURL
            assetTypeId
            sitePlayableFilePath
            lyrics
            numberOfStems
            officialReleaseDate
            bpmRate
            albumId
            albumName
            albumNameForURL
            albumThumbFilePath
            albumImageFilePath
            artistId
            artistName
            artistUrl
            primaryArtists
            featuredArtists
            duration
            durationTime
            categories {
              parentName
              id
              name
            }
            genreCategories {
              id
              name
              parentName
            }
          }
        }
      `,
      variables: {
        ids,
      },
    };

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'content-type': 'application/json',
      },
    };

    const proxy = this.proxyService.getNextProxyConfig();
    if (proxy) {
      axiosConfig.proxy = proxy;
    }

    return this.httpService
      .post('https://search-api.artlist.io/v1/graphql', payload, axiosConfig)
      .pipe(map((response) => response.data));
  }
}
