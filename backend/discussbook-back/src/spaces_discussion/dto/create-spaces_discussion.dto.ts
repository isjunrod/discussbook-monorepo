import { IsNotEmpty, IsString } from "class-validator";

export class CreateSpacesDiscussionDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly access: string;

    @IsString()
    @IsNotEmpty()
    readonly comments: string;

    // Esto para hacer belongsTo y traer los espacios de discusion de un usuario para mostrarlos en la barra lateral izquierda
    @IsString()
    @IsNotEmpty()
    readonly userId: string;
}