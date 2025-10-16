import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AxiosProxyConfig } from 'axios';

interface ProxyRecord {
  host: string;
  port: number;
  username?: string;
  password?: string;
}

@Injectable()
export class ProxyService {
  private readonly proxies: ProxyRecord[];
  private nextProxyIndex = 0;
  private readonly logger = new Logger(ProxyService.name);

  constructor() {
    this.proxies = this.loadProxies();
  }

  public getNextProxyConfig(): AxiosProxyConfig | undefined {
    if (this.proxies.length === 0) {
      return undefined;
    }

    const proxy = this.proxies[this.nextProxyIndex];
    this.nextProxyIndex = (this.nextProxyIndex + 1) % this.proxies.length;

    const config: AxiosProxyConfig = {
      protocol: 'http',
      host: proxy.host,
      port: proxy.port,
    };

    if (proxy.username && proxy.password) {
      config.auth = {
        username: proxy.username,
        password: proxy.password,
      };
    }

    return config;
  }

  private loadProxies(): ProxyRecord[] {
    const filePath =
      process.env.PROXY_FILE_PATH ?? join(process.cwd(), 'proxy.txt');

    try {
      const rawContent = readFileSync(filePath, 'utf8');
      return rawContent
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => this.parseProxyLine(line))
        .filter((record): record is ProxyRecord => record !== undefined);
    } catch (error) {
      this.logger.warn(
        `Unable to load proxies from ${filePath}. Reason: ${
          (error as Error).message
        }`,
      );
      return [];
    }
  }

  private parseProxyLine(line: string): ProxyRecord | undefined {
    const [host, port, username, password] = line.split(':');

    if (!host || !port) {
      this.logger.warn(`Invalid proxy entry skipped: ${line}`);
      return undefined;
    }

    const portNumber = Number.parseInt(port, 10);

    if (Number.isNaN(portNumber) || portNumber <= 0) {
      this.logger.warn(`Invalid proxy port skipped: ${line}`);
      return undefined;
    }

    return {
      host,
      port: portNumber,
      username,
      password,
    };
  }
}
