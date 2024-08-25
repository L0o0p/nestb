import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DataSourceModule } from 'src/datasource/datasource.module';

@Module({
  imports: [DataSourceModule], // add the DataSourceModule to the import array
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
