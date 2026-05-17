import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_users' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, nullable: false })
  name: string;

  @Column({ length: 250, nullable: false, unique: true })
  email: string;

  @Column({ length: 250, nullable: false })
  password: string;
}
