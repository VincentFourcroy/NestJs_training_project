import { Users } from 'src/users/users.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Properties {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('simple-array')
  values: string[]

  @ManyToOne(() => Users, (createdBy) => createdBy)
  createdBy: Users[]
}
