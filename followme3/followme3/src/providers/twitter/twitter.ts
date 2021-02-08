import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TwitterService } from 'ng2-twitter';

/*
  Generated class for the TwitterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TwitterProvider {

  token = null;
  tokenSecret = null;
  consumerKey = 'YOURCONSUMERKEY';
  consumerSecret = 'YOURCONSUMERSECRET';
 
  constructor(private twitter: TwitterService) { }
 
  setTokens(token, tokenSecret) {
    this.token = token;
    this.tokenSecret = tokenSecret;
  }

  postTweet(text) {
    return this.twitter.post(
      'https://api.twitter.com/1.1/statuses/update.json',
      {
        status: text
      },
      {
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret
      },
      {
        token: this.token,
        tokenSecret: this.tokenSecret
      }
    )
      .map(res => res.json());
  }
 
  getHomeTimeline() {
    return this.twitter.get(
      'https://api.twitter.com/1.1/statuses/home_timeline.json',
      {
        count: 10
      },
      {
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret
      },
      {
        token: this.token,
        tokenSecret: this.tokenSecret
      }
    )
      .map(res => res.json());
  };




}
