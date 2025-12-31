import { AppModule } from '@user-service/app/app.module';
import { UserServiceBootstrap } from '@user-service/bootstrap';

void new UserServiceBootstrap(AppModule).withValidation().start();
