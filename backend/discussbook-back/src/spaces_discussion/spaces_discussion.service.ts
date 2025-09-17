import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpaceDiscussion } from './schemas/space_discussion.schema';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Multer } from 'multer';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SpacesDiscussionService {
    constructor(
        @InjectModel(SpaceDiscussion.name)
        private spacesDiscussionModel: Model<SpaceDiscussion>,
        private httpService: HttpService, // Añade esto
    ) {}

    async findAll() {
        return this.spacesDiscussionModel.find()
        .select('-password')
        .populate('userId', '-password')
        .exec();
    }

    async create(file: Multer.File, metadata: any) {
        const parsedMetadata = JSON.parse(metadata);

        if (!file) {
            throw new Error('Se requiere un archivo válido');
        }

        // Configurar parámetros
        const bucketName = 'dicuss-book';
        // Usar el nombre del archivo como Key
        const fileName = parsedMetadata.bookId;
        // URL de CloudFront para el recurso
        const distributionCloudFront = 'd34zaxhvyejrs2.cloudfront.net';

        // Crear cliente S3
        const client = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY || '',
                secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
            },
            region: 'us-east-2',
        });

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer, // Usar el buffer del archivo de Multer
            ContentType: file.mimetype, // Usar mimetype de Multer
        };

        try {
            // Subir el archivo a S3
            await client.send(new PutObjectCommand(params));

            // Generar el URL del objeto
            const url = `https://${distributionCloudFront}/${fileName}`;

            // con el libro creado y su id, podemos crear el espacio de discusión
            const createdSpacesDiscussion = new this.spacesDiscussionModel({
                name: file.originalname,
                access: parsedMetadata.access,
                password: parsedMetadata.password,
                comments: [],
                url,
                bookId: parsedMetadata.bookId,
                userId: parsedMetadata.userId,
            });

            const savedSpaceDiscussion = await createdSpacesDiscussion.save();

            return {
                ...savedSpaceDiscussion.toJSON(), // Usa toJSON() para eliminar propiedades internas
            };
        } catch (error) {
            console.error('Error al subir archivo PDF:', error);
            throw error;
        }
    }

    async getPdfBinaryData(bookId: string): Promise<Buffer> {
        const distributionCloudFront = 'd34zaxhvyejrs2.cloudfront.net';

        try {
            const url = `https://${distributionCloudFront}/${bookId}`;

            // Generar cookie para CloudFront si es necesario
            const cookie = this.createCookies();

            // Hacer la solicitud a CloudFront
            const response = await lastValueFrom(
                this.httpService.get(url + cookie, {
                    responseType: 'arraybuffer',
                }),
            );

            if (response.status !== 200) {
                throw new NotFoundException(`Archivo con nombre ${bookId} no encontrado en CloudFront`);
            }

            // Devolver los datos binarios directamente como Buffer
            return Buffer.from(response.data);
        } catch (error) {
            console.error('Error al obtener los datos binarios del PDF:', error);
            throw error;
        }
    }

    createCookies = () => {
        function loadPrivateKey(privateKeyPath) {
            try {
                console.log('Intentando cargar clave desde:', privateKeyPath);
                return fs.readFileSync(privateKeyPath, 'utf8');
            } catch (error) {
                console.error('Error al cargar la clave privada:', error);
                throw error;
            }
        }

        // Crear política en formato JSON
        function createPolicy(resourceUrl, expiration) {
            return JSON.stringify({
                Statement: [
                    {
                        Resource: resourceUrl,
                        Condition: {
                            DateLessThan: {
                                'AWS:EpochTime': expiration,
                            },
                        },
                    },
                ],
            });
        }

        // Firmar la política con la clave privada
        function signPolicy(policy, privateKey) {
            try {
                const sign = crypto.createSign('RSA-SHA1');
                sign.update(policy);
                sign.end();
                return sign.sign(privateKey, 'base64');
            } catch (error) {
                console.error('Error al firmar la política:', error);
                throw error;
            }
        }

        // Configuración
        const privateKeyPath = path.resolve(__dirname, '../../private_key.pem');
        const resourceUrl = 'https://d34zaxhvyejrs2.cloudfront.net/*';
        const expiration = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // 12 hora desde ahora
        const keyPairId = 'K12GEUDWAVDYYN';

        const privateKey = loadPrivateKey(privateKeyPath);
        const policy = createPolicy(resourceUrl, expiration);
        const signature = signPolicy(policy, privateKey);

        // Generar salida en el formato correcto
        return `?Policy=${Buffer.from(policy).toString('base64')}&Signature=${signature}&Key-Pair-Id=${keyPairId}`;
    };

    // con este endpoint traeriamos todas los espacios de discusion del usuario actual para mostrarlos en la barra lateral izquierda
    findAllByUser(userId: string) {
        return this.spacesDiscussionModel.find({ userId }).exec();
    }

    async update(id: string, updateSpacesDiscussionDto: any) {
        return this.spacesDiscussionModel.findByIdAndUpdate(id, updateSpacesDiscussionDto, { new: true });
    }
}
