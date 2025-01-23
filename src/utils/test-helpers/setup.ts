import { MockProxy, mock } from 'jest-mock-extended';
import { UserRepository } from '../../user/user.interface';
import { EmailService } from '../../email/email.interface';

export const createMockUserRepository = (): MockProxy<UserRepository> => 
  mock<UserRepository>();

export const createMockEmailService = (): MockProxy<EmailService> =>
  mock<EmailService>();
