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
        const channelsOpened: ChannelOpenedStatus[] = await this.channelOpenedRepository.getOpenedChannelTimelineOverviewOf(contract)
        const channelsClosed: ChannelClosedStatus[] = await this.channelClosedRepository.getClosedChannelTimelineOverviewOf(contract)


        let res: ChannelEventStatus[] = channelsOpened.concat(channelsClosed).sort((a, b) => a.blockTimestamp - b.blockTimestamp)

        let closedCount = 0
        res.map((event: any) => {
            if (event.closed_channels_sum) closedCount += (event.closed_channels_sum - closedCount)
            else event.opened_channels_sum -= closedCount
        })

        return this.fillMissingEvent(res)
    }

    private fillMissingEvent(res: any[]): { openedChannel: ChannelOpenedStatus[], closedChannel: ChannelClosedStatus[] } {
        let opened: ChannelOpenedStatus[] = []
        let closed: ChannelClosedStatus[] = []
        let lastOpened = 0
        let lastClosed = 0

        res.forEach(ev => {
            if (ev.opened_channels_sum) {
                opened.push(ev)
                closed.push({ blockTimestamp: ev.blockTimestamp, closed_channels_sum: lastClosed })
                lastOpened = ev.opened_channels_sum
            } else {
                opened.push({ blockTimestamp: ev.blockTimestamp, opened_channels_sum: lastOpened - (ev.closed_channels_sum - lastClosed) })
                closed.push(ev)
                lastOpened -= (ev.closed_channels_sum - lastClosed)
                lastClosed = ev.closed_channels_sum
            }
        })

        return { openedChannel: opened, closedChannel: closed }
    }

    async getChannelsOverview() {
        return await this.tokenNetworkOverviewModel.find().exec()
    }

    async getChannelsOverviewOf(contract: string) {
        return await this.tokenNetworkOverviewModel.find({ tokenNetwork: contract ? contract : { $regex: /.*/ } }).exec()
    }
}