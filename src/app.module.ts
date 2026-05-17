import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentesModule } from './agentes/agentes.module';
import { ExecucoesModule } from './execucoes/execucoes.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuarios/usuarios.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: false,
        entities: [],
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
        migrationsTableName: 'migrations',
      }),
    }),
    AgentesModule,
    ExecucoesModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
