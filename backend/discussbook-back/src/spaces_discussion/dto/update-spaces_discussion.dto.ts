import { PartialType } from '@nestjs/mapped-types';
import { CreateSpacesDiscussionDto } from './create-spaces_discussion.dto';

export class UpdateSpacesDiscussionDto extends PartialType(CreateSpacesDiscussionDto) {}
