import { OmitType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';
import { IsString } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

//@Match() własny dekorator
export class CreateUserDto extends OmitType(UpdateUserDto, ['id'] as const) {
  @IsString()
  @Match<CreateUserDto>('password')
  confirmPassword: string;
}
