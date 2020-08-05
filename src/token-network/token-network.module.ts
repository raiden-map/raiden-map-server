import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelClosed, ChannelClosedSchema } from 'src/models/channel-closed.model';
import { ChannelNewDeposit, ChannelNewDepositSchema } from 'src/models/channel-new-deposit.model';
import { ChannelOpened, ChannelOpenedSchema } from 'src/models/channel-opened.model';
import { ChannelSettled, ChannelSettledSchema } from 'src/models/channel-settled.model';
import { ChannelWithdraw, ChannelWithdrawSchema } from 'src/models/channel-withdraw.model';
import { NonClosingBalanceProofUpdated, NonClosingBalanceProofUpdatedSchema } from 'src/models/non-closing-balance-proof-updated.model';
import { TokenInfo, TokenInfoSchema } from 'src/models/token-info.model';
import { TokenNetworkCreated, TokenNetworkCreatedSchema } from 'src/models/token-network-created.model';
import { TokenNetworkController } from './token-network.controller';
import { TokenNetworkService } from './token-network.service';
import { ChannelOpenedRepository } from 'src/repositories/channel-opened.repository';
import { ChannelClosedRepository } from 'src/repositories/channel-closed.repository';
import { ParticipantRepository } from 'src/repositories/participants.repository';
import { TokenNetworkOverview, TokenNetworkOverviewSchema } from 'src/models/token-network-overview.model';
import { ChannelTimelineOverview, ChannelTimelineOverviewSchema } from 'src/models/channel-timeline-overview.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChannelOpened.name, schema: ChannelOpenedSchema },
      { name: ChannelClosed.name, schema: ChannelClosedSchema },
      { name: ChannelNewDeposit.name, schema: ChannelNewDepositSchema },
      { name: ChannelSettled.name, schema: ChannelSettledSchema },
      { name: ChannelWithdraw.name, schema: ChannelWithdrawSchema },
      { name: NonClosingBalanceProofUpdated.name, schema: NonClosingBalanceProofUpdatedSchema },
      { name: TokenNetworkCreated.name, schema: TokenNetworkCreatedSchema },
      { name: TokenInfo.name, schema: TokenInfoSchema },
      { name: TokenNetworkOverview.name, schema: TokenNetworkOverviewSchema },
      { name: ChannelTimelineOverview.name, schema: ChannelTimelineOverviewSchema },
    ])
  ],
  controllers: [TokenNetworkController],
  providers: [
    TokenNetworkService,
    ChannelOpenedRepository,
    ChannelClosedRepository,
    ParticipantRepository,
  ]
})
export class TokenNetworkModule { }
