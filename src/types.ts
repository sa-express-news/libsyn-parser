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