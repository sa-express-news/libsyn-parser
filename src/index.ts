import * as xml2js from 'xml2js';
import * as fetch from 'isomorphic-fetch';
import { RSSResponse, RSSChannel, PodcastMeta, PodcastEpisode, RSSFeedItem } from './types';

const parser = new xml2js.Parser({
    trim: true
});

const parsePromise = (text: string): Promise<object> => {
    return new Promise((resolve, reject) => {
        parser.parseString(text, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

export const fetchFeed = async (url: string): Promise<RSSResponse> => {
    try {
        const feedResponse = await fetch(url);
        const feedText = await feedResponse.text();
        const feedObject = await parsePromise(feedText) as RSSResponse;
        return feedObject;
    } catch (e) {
        throw new Error(e);
    }
}

export const getPodcastMeta = (rssChannel: RSSChannel): PodcastMeta => {
    return {
        title: rssChannel.title[0],
        description: rssChannel.description[0],
        image: rssChannel.image[0].link[0]
    }
}

export const getPodcastEpisodes = (rssChannel: RSSChannel): PodcastEpisode[] => {
    let episodes: PodcastEpisode[] = [];
    rssChannel.item.forEach((item: RSSFeedItem) => {
        episodes.push({
            title: item.title[0],
            publicationDate: new Date(item.pubDate[0]),
            link: item.link[0],
            description: item.description[0]
        });
    });

    return episodes;
}
