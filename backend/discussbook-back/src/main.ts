import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3000', // Cambia esto a la URL de tu frontend
        methods: 'GET,HEADPUT,PATCH,POST,DELETE',
        // credentials: true, // Si usas cookies o autenticación basada en sesiones
        // exposedHeaders: ['Authorization'], // Asegúrate de exponer el header 'Authorization'
        exposedHeaders: ['Authorization'],
        credentials: true,
    });

    await app.listen(4000);
}
bootstrap();
