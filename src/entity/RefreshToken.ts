import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";

@Entity()
class RefreshToken{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    jwtId: string;

    @ManyToOne(type => User, user => user.refreshTokens)
    user: User

    @Column({default: false})
    used: boolean;

    // Invalidate refreshToken when user logout so no one can 
    // generate new access token from refreshToken when user is logged out
    @Column({default: false})
    invalidated: boolean

    @Column()
    expiryDate: Date

    // Meta Information
    @CreateDateColumn()
    creationDate: Date

    @UpdateDateColumn()
    updateDate: Date
}

export default RefreshToken;