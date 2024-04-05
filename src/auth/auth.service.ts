import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from 'src/users/users.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ email })

    if (!user) {
      throw new HttpException(
        'Either email or password is invalid.',
        HttpStatus.UNAUTHORIZED,
      )
    }

    const isMatch = await bcrypt.compare(pass, user.password)

    if (isMatch) {
      return user
    } else {
      throw new HttpException(
        'Either email or password is invalid.',
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user.role, userId: user.id }
    return {
      token: this.jwtService.sign(payload),
    }
  }

  verifyToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token)
      return decodedToken.userId
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
