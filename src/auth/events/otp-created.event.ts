export enum OtpEvent {
  CREATED = 'auth.otp.created',
}

export class OtpCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {}
}
