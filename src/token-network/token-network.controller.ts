import { Controller, Get, Param } from '@nestjs/common';
import { TokenNetworkService } from './token-network.service';

@Controller('token-network')
export class TokenNetworkController {

    constructor(private readonly tokenNetworkService: TokenNetworkService) { }

    @Get()
    getTokenNetworks() {
        return this.tokenNetworkService.getAllTokenNetworks()
    }

    @Get('info')
    getTokenInfo() {
        return this.tokenNetworkService.getAllTokenInfo()
    }

    @Get('info/:_id')
    getTokenInfoOf(@Param() params) {
        return this.tokenNetworkService.getTokenInfoOf(params._id)
    }

    @Get('channel-opened/:contract')
    getOpenedChannelOf(@Param() params) {
        return this.tokenNetworkService.getOpenedChannelOf(params.contract)
    }

    @Get('channel-closed/:contract')
    getClosedChannelOf(@Param() params) {
        return this.tokenNetworkService.getClosedChannelOf(params.contract)
    }

    @Get('channel-timeline/:contract')
    getChannelTimelineOf(@Param() params) {
        return this.tokenNetworkService.getChannelsTimelineOf(params.contract)
    }

    @Get('participant-overview')
    getParticipantOverview() {
        return this.tokenNetworkService.getParticipantOverview()
    }

    @Get('participant-overview/:contract')
    getParticipantOverviewOf(@Param() params) {
        return this.tokenNetworkService.getParticipantOverviewOf(params.contract)
    }

    @Get('channel-overview')
    getChannelOverview() {
        return this.tokenNetworkService.getChannelsOverview()
    }

    @Get('channel-overview/:contract')
    getChannelOverviewOf(@Param() params) {
        return this.tokenNetworkService.getChannelsOverviewOf(params.contract)
    }
}
