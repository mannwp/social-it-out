import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType({ isAbstract: true })
export abstract class PageInfo {
  @Field(() => String, { nullable: true })
  endCursor: string;

  @Field(() => Boolean)
  hasNextPage: boolean;
}

export function CursorPaginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class CursorPaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return CursorPaginatedType;
}
