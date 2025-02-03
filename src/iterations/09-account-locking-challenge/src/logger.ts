import { Logger as TsLog } from 'tslog';

export interface Logger {
  info: (message: string, data: any) => void;
}

export class TslogLooger implements Logger {
  constructor(private log = new TsLog()) {}
  info(message: string, data: any): void {
    this.log.info(message, data);
  }
}
