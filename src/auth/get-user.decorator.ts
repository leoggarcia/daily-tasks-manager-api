import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if(request.user){
    return request.user; // viene del JWT guard
  }else{
    return undefined
  }
});
