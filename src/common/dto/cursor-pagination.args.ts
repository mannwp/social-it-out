import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CursorPaginationArgs {
  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => Int, { defaultValue: 10 })
  first: number;
}
