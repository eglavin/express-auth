import { z } from "zod";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Profile } from "./Profile";

export const AccountSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@Entity()
@Unique("unique_email", ["email"])
export class Account implements z.infer<typeof AccountSchema> {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
  })
  email: string;

  @Column({
    type: "text",
  })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Partial<Profile> | null;
}
