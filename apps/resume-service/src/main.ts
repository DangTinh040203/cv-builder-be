import { AppModule } from '@resume-service/app/app.module';
import { ResumeServiceBootstrap } from '@resume-service/bootstrap';

void new ResumeServiceBootstrap(AppModule).withValidation().start();
