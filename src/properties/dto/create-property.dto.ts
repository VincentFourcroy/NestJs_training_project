import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Users } from 'src/users/users.entity'

export class CreatePropertyDto {
  @IsNumber()
  @IsOptional()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString({ each: true })
  @IsNotEmpty()
  values: string[]

  @IsNumber()
  @IsNotEmpty()
  createdBy: Users[]
}
