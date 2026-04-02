import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  @MinLength(4)
  password: string;
}
@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  @MinLength(4)
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  access_token: string;
}

@InputType()
export class FollowInput {
  @Field(() => ID)
  targetId: string;
}
