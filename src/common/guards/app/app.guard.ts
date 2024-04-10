import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    //query
    const query = request.query;
    //body
    const body = request.body;
    // console.log('request', request);
    // console.log('response', response);
    const metadata = this.reflector.get('roles', context.getHandler());
    // console.log(metadata);
    return true;
  }
}

//reflector- możliwośc odczytania metadanych
//za pomoca decoratora "Admin" ustawiamy role admin na endpoincie
// z contaxtu mozemy rolę pobrać i sprawdzić czy user ma dostep
//mozna było tez ustawić dekoratorem @SetMetaData() bezpośrednio na endpoincie, ale trzeba by sie powtrarzac tym zapisem w wielu miejscach