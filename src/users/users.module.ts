import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DataSourceModule } from 'src/datasource/datasource.module';

@Module({
  imports: [DataSourceModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // 确保添加这一行来导出 UsersService
})
export class UsersModule {}
