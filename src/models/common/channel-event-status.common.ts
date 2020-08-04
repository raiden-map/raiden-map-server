export abstract class ChannelEventStatus {
    blockTimestamp?: number;
    block?: number;
}
export class ChannelOpenedStatus extends ChannelEventStatus {
    opened_channels_sum?: number;
    opened_channel_identifiers?: number[];
}

export class ChannelClosedStatus extends ChannelEventStatus {
    closed_channels_sum?: number;
    closed_channel_identifiers?: number[];
}