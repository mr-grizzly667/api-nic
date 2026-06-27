import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NewsModule } from './news/news.module';
import { DocumentsModule } from './documents/documents.module';
import { RegistrarsModule } from './registrars/registrars.module';
import { DomainsModule } from './domains/domains.module';
import { SupportModule } from './support/support.module';
import { EmailModule } from './email/email.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    NewsModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    DocumentsModule,
    RegistrarsModule,
    DomainsModule,
    SupportModule,
    EmailModule,
    SettingsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
