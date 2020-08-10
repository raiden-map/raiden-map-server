import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenNetworkModule } from './token-network/token-network.module';
import { MongooseModule } from '@nestjs/mongoose';
import { environments } from './environments';

//const mongodb = 'mongodb://localhost:27017/raiden-map'
const mongodb = 'mongodb://51.136.5.3:27017/raiden-map'

@Module({
  imports: [
    MongooseModule.forRoot(mongodb, {
      user: environments.mongoUser, pass: environments.mongoPsw,
    }),
    TokenNetworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
