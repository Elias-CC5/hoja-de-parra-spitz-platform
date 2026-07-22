import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { UploadsController } from './controllers/uploads.controller';

@Module({
  controllers: [UploadsController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class UploadsModule {}
