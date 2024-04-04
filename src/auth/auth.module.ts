import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Users } from 'src/users/users.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Users]), PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
