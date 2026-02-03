import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiAuditService } from './audit.service';
import { Roles } from '@myorg/auth';
import { Role } from '@myorg/data';
import { JwtAuthGuard, RolesGuard } from '@myorg/auth';

@Controller('audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private audit: ApiAuditService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  list() {
    return this.audit.list();
  }
}
