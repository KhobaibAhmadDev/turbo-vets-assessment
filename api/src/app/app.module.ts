import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@myorg/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { AuthController } from './auth/auth.controller';
import { ApiAuthService } from './auth/auth.service';
import { ApiAuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { Task, User, Organization } from '@myorg/data';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'P@ssw0rd4132',
      database: 'turbovets',
      entities: [Task, User, Organization], 
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([Task, User, Organization]), 
  ],
  controllers: [AppController, TaskController, AuthController, AuditController],
  providers: [AppService, TasksService, ApiAuthService, ApiAuditService], 
})
export class AppModule {}