import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthResponse } from './dto/user.model';

@Resolver()
export class AuthResolve {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    return await this.authService.login({ username, password });
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  async getProfile(@Context() context) {
    const user = context.req.user;
    return `Usuario autenticado: ${user.username}`;
  }
}
