import * as mocha from 'mocha';
import * as chai from 'chai';
import * as nock from 'nock';
import { stub } from 'sinon';
import * as path from 'path';
import * as fetch from 'isomorphic-fetch';
import { fetchFeed, getPodcastMeta, getPodcastEpisodes, getPodcast } from './index'

const { assert } = chai;

describe('Libsyn Parser', async () => {
    const expressBriefingEndpoint = 'https://expressbriefing.libsyn.com/rss/';
    const enDepthEndpoint = 'https://endepth.libsyn.com/rss/';
    const badEndpoint = 'https://fail.com/rss';
    before(() => {
        const briefingServer = nock(expressBriefingEndpoint)
            .persist()
            .get('/')
            .replyWithFile(200, path.join(__dirname, '../src/feeds/express-briefing.rss'));

        const depthServer = nock(enDepthEndpoint)
            .persist()
            .get('/')
            .replyWithFile(200, path.join(__dirname, '../src/feeds/en-depth.rss'));

        const badServer = nock(badEndpoint)
            .get('/')
            .reply(500);
    });
    after(() => {
        nock.cleanAll();
    });

    describe('getPodcast', () => {
        let podcasts;
        before(async () => {
            const briefing = await getPodcast(expressBriefingEndpoint);
            const depth = await getPodcast(enDepthEndpoint);
            podcasts = [briefing, depth];
        });
        it('returns an object', () => {
            podcasts.forEach((podcast) => {
                assert.isObject(podcast);
            });
        });
        it('the object has a meta property, which is an object', () => {
            podcasts.forEach((podcast) => {
                assert.property(podcast, 'meta');
                assert.isObject(podcast.meta);
            });
        });
        it('the object has an episodes property, which is an array of objects', () => {
            podcasts.forEach((podcast) => {
                assert.property(podcast, 'episodes');
                assert.isArray(podcast.episodes);
                podcast.episodes.forEach((episode) => {
                    assert.isObject(episode);
                });
            });
        });
    });

    describe('fetchFeed', () => {
        describe('successful network request', () => {
            let feeds;
            before(async () => {
                const briefingFeed = await fetchFeed(expressBriefingEndpoint);
                const depthFeed = await fetchFeed(enDepthEndpoint);
                feeds = [briefingFeed, depthFeed];
            });

            it('returns a promise that resolves to an object', () => {
                feeds.forEach((feed) => {
                    assert.isObject(feed);
                });
            });
            it('the object has an rss property', () => {
                feeds.forEach((feed) => {
                    assert.property(feed, 'rss');
                });
            });
            it(`the object's rss property has a channel property`, () => {
                feeds.forEach((feed) => {
                    assert.property(feed.rss, 'channel');
                });
            });
            it('the rss.channel property is an array of length 1', () => {
                feeds.forEach((feed) => {
                    assert.isArray(feed.rss.channel);
                    assert.lengthOf(feed.rss.channel, 1);
                });
            });
            it('the one item in the rss.channel array is an object', () => {
                feeds.forEach((feed) => {
                    const channel = feed.rss.channel[0];
                    assert.isObject(channel);
                });
            })
        });
        describe('unsuccessful network request', () => {
            it('throws an error', async () => {

                let err;

                try {
                    const feed = await fetchFeed(badEndpoint);
                } catch (e) {
                    err = e;
                }

                assert.typeOf(err, 'Error');
            });
        });
    });

    describe('getPodcastMeta', () => {
        let channels;
        before(async () => {
            const briefingFeed = await fetchFeed(expressBriefingEndpoint);
            const depthFeed = await fetchFeed(enDepthEndpoint);
            channels = [briefingFeed.rss.channel[0], depthFeed.rss.channel[0]];
        });
        it('returns an object', () => {
            channels.forEach((channel) => {
                assert.isObject(getPodcastMeta(channel));
            });
        });
        it('the object has a title property, which is a string', () => {
            channels.forEach((channel) => {
                const meta = getPodcastMeta(channel);
                assert.property(meta, 'title');
                assert.isString(meta.title);
            });
        });
        it('the object has a description property, which is a string', () => {
            channels.forEach((channel) => {
                const meta = getPodcastMeta(channel);
                assert.property(meta, 'description');
                assert.isString(meta.description);
            });
        });
        it('the object has an imageURL property, which is a string', () => {
            channels.forEach((channel) => {
                const meta = getPodcastMeta(channel);
                assert.property(meta, 'imageURL');
                assert.isString(meta.imageURL);
            });
        });
    });

    describe('getPodcastEpisodes', () => {
        let channels;
        before(async () => {
            const briefingFeed = await fetchFeed(expressBriefingEndpoint);
            const depthFeed = await fetchFeed(enDepthEndpoint);
            channels = [briefingFeed.rss.channel[0], depthFeed.rss.channel[0]];
        });
        it('returns an array', () => {
            channels.forEach((channel) => {
                const episodes = getPodcastEpisodes(channel);
                assert.isArray(episodes);
            });
        });
        it('each array item is an object', () => {
            channels.forEach((channel) => {
                const episodes = getPodcastEpisodes(channel);
                episodes.forEach((episode) => {
                    assert.isObject(episode);
                });
            });
        });
        it('each object has a string title property', () => {
            channels.forEach((channel) => {
                const episodes = getPodcastEpisodes(channel);
                episodes.forEach((episode) => {
                    assert.property(episode, 'title');
                    assert.isString(episode.title);
                });
            });
        });
        it('each object has a string link property', () => {
            channels.forEach((channel) => {
                const episodes = getPodcastEpisodes(channel);
                episodes.forEach((episode) => {
                    assert.property(episode, 'link');
                    assert.isString(episode.link);
                });
            });
        });
        it('each object has a string description property', () => {
            channels.forEach((channel) => {
                const episodes = getPodcastEpisodes(channel);
                episodes.forEach((episode) => {
                    assert.property(episode, 'description');
                    assert.isString(episode.description);
                });
            });
        });
        it('each object has a Date publicationDate property', () => {
            channels.forEach((channel) => {
                const episodes = getPodcastEpisodes(channel);
                episodes.forEach((episode) => {
                    assert.property(episode, 'publicationDate');
                    assert.typeOf(episode.publicationDate, 'Date');
                });
            });
        });
    });
});

