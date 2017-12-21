import * as mocha from 'mocha';
import * as chai from 'chai';
import * as nock from 'nock';
import { stub } from 'sinon';
import * as path from 'path';
import * as fetch from 'isomorphic-fetch';
import { parsePromise, fetchFeed, getPodcastMeta } from './index'

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

    describe('fetchFeed', () => {
        describe('successful network request', async () => {
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

    // describe('getPodcastMeta', () => {

    //     it('returns an object', () => {

    //     });
    // });
});

