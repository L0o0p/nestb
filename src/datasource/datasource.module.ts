// datasource.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from './typeorm.module';
import { DataSourceService } from './datasource.service';

@Module({
  imports: [TypeOrmModule],
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class DataSourceModule {}
