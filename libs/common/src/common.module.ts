import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './data-source';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options)],
  exports: [TypeOrmModule],
})
export class CommonModule {}
