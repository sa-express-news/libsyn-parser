export function getPodcast(feedUrl: string): Promise<Podcast>;

export interface RSSResponse {
    rss: {
        channel: [RSSChannel];
    }
}

export interface RSSChannel {
    title: [string];
    description: [string];
    image: [{
        url: [string];
        title: [string];
        link: [string];
    }];
    item: RSSFeedItem[];
}

export interface RSSFeedItem {
    title: [string];
    pubDate: [string];
    link: [string];
    description: [string];
}

export interface PodcastMeta {
    title: string;
    description: string;
    imageURL: string;
}

export interface PodcastEpisode {
    title: string;
    publicationDate: Date;
    audioFileURL: string;
    description: string;
}

export interface Podcast {
    meta: PodcastMeta;
    episodes: PodcastEpisode[];
}