import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
    const allProperties = await this.propertiesRepository.find()
    return allProperties
  }

  async findOne(id: number): Promise<Properties> {
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
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Properties> {
    const newProperty = createPropertyDto

    await this.propertiesRepository.save(newProperty)

    return newProperty
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Properties> {
    const propertyToUpdate = await this.propertiesRepository.findOne({
      where: { id },
    })

    if (!propertyToUpdate)
      throw new HttpException(
        'No such property found in Database',
        HttpStatus.NOT_FOUND,
      )

    Object.assign(propertyToUpdate, { ...updatePropertyDto })

    await this.propertiesRepository.save(propertyToUpdate)

    return propertyToUpdate
  }

  async delete(id: number): Promise<void> {
    const propertyToDelete = await this.propertiesRepository.findOne({
      where: { id },
    })
    await this.propertiesRepository.delete(id)
    if (!propertyToDelete) {
      throw new HttpException(
        'No such property found in Database',
        HttpStatus.NOT_FOUND,
      )
    }
  }
}
