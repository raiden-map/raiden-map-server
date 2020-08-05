import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelClosed } from 'src/models/channel-closed.model';
import { ChannelNewDeposit } from 'src/models/channel-new-deposit.model';
import { ChannelOpened } from 'src/models/channel-opened.model';
import { ChannelSettled } from 'src/models/channel-settled.model';
import { ChannelWithdraw } from 'src/models/channel-withdraw.model';
import { NonClosingBalanceProofUpdated } from 'src/models/non-closing-balance-proof-updated.model';
import { TokenInfo } from 'src/models/token-info.model';
import { TokenNetworkCreated } from 'src/models/token-network-created.model';
import { ChannelOpenedStatus, ChannelClosedStatus, ChannelEventStatus } from 'src/models/common/channel-event-status.common';
import { ChannelOpenedRepository } from 'src/repositories/channel-opened.repository';
import { ChannelClosedRepository } from 'src/repositories/channel-closed.repository';
import { ParticipantRepository } from 'src/repositories/participants.repository';
import { TokenNetworkOverview } from 'src/models/token-network-overview.model';
import { ChannelTimelineOverview } from 'src/models/channel-timeline-overview.model';
import { TokenNetworkOverviewDto } from 'src/models/dto/token-network-overview.dto';

@Injectable()
export class TokenNetworkService {

    constructor(
        @InjectModel(TokenNetworkCreated.name) private readonly tokenNetworkCreatedModel: Model<TokenNetworkCreated>,
        @InjectModel(TokenInfo.name) private readonly tokenInfoModel: Model<TokenInfo>,
        @InjectModel(ChannelClosed.name) private readonly channelClosedModel: Model<ChannelClosed>,
        @InjectModel(ChannelNewDeposit.name) private readonly channelNewDepositModel: Model<ChannelNewDeposit>,
        @InjectModel(ChannelOpened.name) private readonly channelOpenedModel: Model<ChannelOpened>,
        @InjectModel(ChannelSettled.name) private readonly channelSettledModel: Model<ChannelSettled>,
        @InjectModel(ChannelWithdraw.name) private readonly channelWithdrawModel: Model<ChannelWithdraw>,
        @InjectModel(NonClosingBalanceProofUpdated.name) private readonly nonClosingBalanceProofUpdatedModel: Model<NonClosingBalanceProofUpdated>,
        @InjectModel(TokenNetworkOverview.name) private readonly tokenNetworkOverviewModel: Model<TokenNetworkOverview>,
        @InjectModel(ChannelTimelineOverview.name) private readonly channelTimelineOverviewModel: Model<ChannelTimelineOverview>,
        private readonly channelOpenedRepository: ChannelOpenedRepository,
        private readonly channelClosedRepository: ChannelClosedRepository,
        private readonly participantRepository: ParticipantRepository,
    ) { }

    getTokenInfoOf(contract: string) {
        throw new Error("Method not implemented.");
    }

    async getAllTokenInfo() {
        return await this.tokenInfoModel.find().exec()
    }

    async getAllTokenNetworks() {
        return await this.tokenNetworkCreatedModel.find().exec()
    }

    async getOpenedChannelOf(contract: string): Promise<ChannelOpened[]> {
        return await this.channelOpenedModel.find({ address: contract }).exec()
    }

    async getClosedChannelOf(contract: string): Promise<ChannelClosed[]> {
        return await this.channelClosedModel.find({ address: contract }).exec()
    }

    async getParticipantOverview() {
        return await this.participantRepository.getParticipantOverviewOf(null)
    }

    async getParticipantOverviewOf(contract: string) {
        return await this.participantRepository.getParticipantOverviewOf(contract)
    }

    async getChannelsTimelineOf(contract: string) {
        return await this.channelTimelineOverviewModel.findOne({ tokenNetwork: contract }).exec()
    }

    async getChannelsOverview() {
        let totalOverview: TokenNetworkOverviewDto = {
            channelClosed: 0,
            channelOpened: 0,
            channelSettled: 0,
            withdrawCount: 0,
            depositCount: 0,
        }
        const tokenNetworkOverview: TokenNetworkOverview[] = await this.tokenNetworkOverviewModel.find().exec()
        tokenNetworkOverview.forEach(tko => {
            totalOverview.channelClosed += tko.channelClosed
            totalOverview.channelOpened += tko.channelOpened
            totalOverview.channelSettled += tko.channelSettled
            totalOverview.withdrawCount += tko.withdrawCount
            totalOverview.depositCount += tko.depositCount
        })

        return totalOverview
    }

    async getChannelsOverviewOf(contract: string) {
        return await this.tokenNetworkOverviewModel.find({ tokenNetwork: contract ? contract : { $regex: /.*/ } }).exec()
    }
}