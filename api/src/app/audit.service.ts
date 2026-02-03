import { Injectable } from '@nestjs/common';

export type AuditEntry = {
  timestamp?: string;
  action: string;
  actor: string;
  resource: string;
  resourceId?: string;
};

@Injectable()
export class ApiAuditService {
  private entries: AuditEntry[] = [];

  log(entry: AuditEntry) {
    const e = { ...entry, timestamp: new Date().toISOString() };
    this.entries.push(e);
    console.info('[AUDIT]', e);
  }

  list() {
    return this.entries.slice().reverse();
  }
}
