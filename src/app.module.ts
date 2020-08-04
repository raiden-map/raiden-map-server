import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenNetworkModule } from './token-network/token-network.module';
import { MongooseModule } from '@nestjs/mongoose';

//const mongodb = 'mongodb://localhost:27017/raiden-map'
const mongodb = 'mongodb://51.136.5.3:27017/raiden-map'

@Module({
  imports: [
    MongooseModule.forRoot(mongodb, {useFindAndModify: false}),
    TokenNetworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
