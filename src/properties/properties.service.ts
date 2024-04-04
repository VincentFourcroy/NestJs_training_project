import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Properties } from './properties.entity'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Properties)
    private propertiesRepository: Repository<Properties>,
  ) {}

  async findAll(): Promise<Properties[]> {
    try {
      const allProperties = await this.propertiesRepository.find()
      return allProperties
    } catch (error) {
      console.error('An error occured while fetching the properties: ', error)
      throw error
    }
  }

  async findOne(id: number): Promise<Properties> {
    try {
      const propertyById = await this.propertiesRepository
        .createQueryBuilder('property')
        .select([
          'property.id',
          'property.name',
          'property.values',
          'createdBy.name',
        ])
        .leftJoin('property.createdBy', 'createdBy')
        .where('property.id = :id', { id })
        .getOne()

      if (!propertyById) {
        throw new HttpException(
          'No such property found in Database',
          HttpStatus.NOT_FOUND,
        )
      }

      return propertyById
    } catch (error) {
      console.error('An error occured while fetching the property: ', error)
      // throw error
    }
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Properties> {
    try {
      const newProperty = createPropertyDto

      await this.propertiesRepository.save(newProperty)

      return newProperty
    } catch (error) {
      console.error('An error occured while creating the property: ', error)
      throw error
    }
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Properties> {
    try {
      const propertyToUpdate = await this.propertiesRepository.findOne({
        where: { id },
      })

      if (!propertyToUpdate)
        throw new NotFoundException('No such property found in Database')

      Object.assign(propertyToUpdate, { ...updatePropertyDto })

      await this.propertiesRepository.save(propertyToUpdate)

      return propertyToUpdate
    } catch (error) {
      console.error('An error occured while updating the property: ', error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const propertyToDelete = await this.propertiesRepository.findOne({
        where: { id },
      })
      await this.propertiesRepository.delete(id)
      if (!propertyToDelete)
        throw new NotFoundException('No such property found in Database')
    } catch (error) {
      console.error('An error occured while deleting the property: ', error)
      throw error
    }
  }
}
