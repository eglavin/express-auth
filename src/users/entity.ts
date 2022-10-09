import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  name: string;

  @Column({
    type: "text",
    unique: true,
  })
  email: string;
}
