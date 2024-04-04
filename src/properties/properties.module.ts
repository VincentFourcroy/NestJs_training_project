import { Module } from '@nestjs/common'
import { PropertiesController } from './properties.controller'
import { PropertiesService } from './properties.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Properties } from './properties.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Properties])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
