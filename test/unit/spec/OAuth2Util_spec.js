/* eslint max-len: [2, 140] */
import Util from 'util/OAuth2Util';
import createAuthClient from 'widget/createAuthClient';
import Settings from '../../../src/models/Settings';
import { AuthSdkError } from '@okta/okta-auth-js';


// TODO: rewrite
describe('util/OAuth2Util', function () {
  
  describe('getTokens', function () {
    // TODO

    it('exists', () => {
      expect(Util.getTokens).toBeTruthy();
    });

    it('emits SDK errors through \'error\' event', function (done) {
      const authClient = createAuthClient({issuer: 'https://foo/default'});
      const settings = new Settings({
        baseUrl: 'https://foo'
      });
      settings.setAuthClient(authClient);


      spyOn(authClient.token, 'getWithPopup').and.callFake(function () {
        return new Promise(function () {
          throw new AuthSdkError('Auth SDK error');
        });
      });

      let modelTriggerSpy;
      let appStateTriggerSpy;

      return new Promise(function (resolve) {
        modelTriggerSpy = jasmine.createSpy('model.trigger').and.callFake(function () {
          resolve();
        });
        appStateTriggerSpy = jasmine.createSpy('model.appState.trigger').and.callFake(function () {
          resolve();
        });
        
        class MockModel {
          constructor () {
            this.appState = {
              trigger: appStateTriggerSpy
            };
            this.trigger = modelTriggerSpy;
          }
        }
  
        class MockController {
          constructor () {
            this.model = new MockModel();
            this.trigger = function () {};
          }
        }
  
        const controller = new MockController();
        Util.getTokens(settings, {}, controller);
      }).then(function () {
        expect(modelTriggerSpy).toHaveBeenCalledTimes(1);
        const exceptionMessage = modelTriggerSpy.calls.mostRecent().args[2].responseJSON.message;
        expect(exceptionMessage).toEqual('Auth SDK error');
        expect(appStateTriggerSpy).toHaveBeenCalledTimes(1);
        expect(appStateTriggerSpy.calls.mostRecent().args[0]).toEqual('removeLoading');
        done();
      }).catch(done.fail);
    });
  });
});
