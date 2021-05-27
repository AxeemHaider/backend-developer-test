import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import RefreshToken from "./RefreshToken";

@Entity()
class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    age: number;

    @Column()
    password: string; // Hashed Password

    @OneToMany(type => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken
}

export default User;