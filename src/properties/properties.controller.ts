import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common'
import { PropertiesService } from './properties.service'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get('all_properties') // /properties/all_properties
  findAll() {
    return this.propertiesService.findAll()
  }

  @Get('property/:id') // /properties/property/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id)
  }

  @Post('create') // /properties/create
  create(@Body(ValidationPipe) createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto)
  }

  @Patch('update/:id') // /properties/update/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, updateUserDto)
  }

  @Delete('delete/:id') // /properties/delete/:id
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.delete(id)
  }
}
