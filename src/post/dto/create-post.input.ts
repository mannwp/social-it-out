import { InputType, Field } from '@nestjs/graphql';
import { PostStatus } from '../enums';

@InputType()
export class CreatePostInput {
  @Field()
  caption: string;

  @Field(() => PostStatus)
  status: PostStatus;
}
