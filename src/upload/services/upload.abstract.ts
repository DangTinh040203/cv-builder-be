export abstract class UploadFileServiceAbstract {
  abstract uploadFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string }>;
}
