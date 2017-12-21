import * as xml2js from 'xml2js';
import * as fetch from 'isomorphic-fetch';
import { RSSResponse, PodcastMeta } from './types';

const parser = new xml2js.Parser({
    trim: true
});

export const parsePromise = (text: string): Promise<object> => {
    return new Promise((resolve, reject) => {
        parser.parseString(text, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

export const getPodcastMeta = (rssResponse: RSSResponse): PodcastMeta => {
    const channel = rssResponse.rss.channel[0];

    return {
        title: channel.title[0],
        description: channel.description[0],
        image: channel.image[0].link[0]
    }

}
export const fetchFeed = async (url: string): Promise<object> => {
    try {
        const feedResponse = await fetch(url);
        const feedText = await feedResponse.text();
        const feedObject = await parsePromise(feedText);
        return feedObject;
    } catch (e) {
        throw new Error(e);
    }
}