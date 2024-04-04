import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Users } from './users.entity'
import { NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    try {
      const allUsers = await this.usersRepository.find()
      return allUsers
    } catch (error) {
      console.error('An error occured while fetching the users: ', error)
      throw error
    }
  }

  async findOne(id: number): Promise<Users> {
    try {
      const userById = await this.usersRepository.findOneBy({ id })
      if (!userById)
        throw new NotFoundException('No such user found in Database')

      return userById
    } catch (error) {
      console.error('An error occured while fetching the user: ', error)
      throw error
    }
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

      const newUser = {
        ...createUserDto,
        password: hashedPassword,
      }

      await this.usersRepository.save(newUser)

      return newUser
    } catch (error) {
      console.error('An error occured while creating the user: ', error)
      throw error
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    try {
      const userToUpdate = await this.usersRepository.findOne({ where: { id } })

      if (!userToUpdate) throw new NotFoundException()

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt)

      Object.assign(userToUpdate, {
        ...updateUserDto,
        password: hashedPassword,
      })

      await this.usersRepository.save(userToUpdate)

      return userToUpdate
    } catch (error) {
      console.error('An error occured while updating the user: ', error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const userToDelete = await this.usersRepository.findOne({
        where: { id },
      })
      await this.usersRepository.delete(id)
      if (!userToDelete)
        throw new NotFoundException('No such user found in Database')
    } catch (error) {
      console.error('An error occured while deleting the user: ', error)
      throw error
    }
  }
}
