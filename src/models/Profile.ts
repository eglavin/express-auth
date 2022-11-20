import { z } from "zod";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Account } from "./Account";

export const ProfileSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(4).nullable(),
  phoneNumber: z.string().nullable(),
  address: z
    .object({
      line1: z.string(),
      line2: z.string().nullable(),
      line3: z.string().nullable(),
      city: z.string().nullable(),
      state: z.string(),
      zip: z.string().nullable(),
      country: z.string(),
    })
    .nullable(),
  dateOfBirth: z.string().nullable(),
});

@Entity()
@Unique("unique_username", ["username"])
export class Profile implements z.infer<typeof ProfileSchema> {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
  })
  name: string;

  @Column({
    type: "text",
    nullable: true,
  })
  username: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  phoneNumber: string | null;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  address: {
    line1: string;
    line2: string | null;
    line3: string | null;
    city: string | null;
    state: string;
    zip: string | null;
    country: string;
  } | null;

  @Column({
    type: "date",
    nullable: true,
  })
  dateOfBirth: string | null;

  @OneToOne(() => Account, (user) => user.profile)
  @JoinColumn()
  user: Partial<Account>;
}
