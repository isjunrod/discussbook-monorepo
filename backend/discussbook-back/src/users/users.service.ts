import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto) {
        const createdUser = new this.userModel({
            email: createUserDto.email,
            password: createUserDto.password,
        });
        return createdUser.save();
    }

    // findAll() {
    //     return `This action returns all users`;
    // }

    async findOne(id: string) {
        return this.userModel
            .findOne({ _id: id })
            .select('-password') // Excluir el campo password del documento principal
            .exec();
    }

    async findOneByEmail(email: string) {
        return this.userModel
            .findOne({ email })
            .exec();
    }

    // async update(id: string, updateUserDto: UpdateUserDto) {
    //     await this.userModel.updateOne({ _id: id }, updateUserDto).exec();
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} user`;
    // }
}
