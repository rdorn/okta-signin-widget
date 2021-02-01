/*!
 * Copyright (c) 2015-2016, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { _ } from 'okta';
import hbs from 'handlebars-inline-precompile';
import FooterSignout from './FooterSignout';

export default FooterSignout.extend({
  template: hbs(
    '\
      {{#if hasFactorPageCustomLink}}\
        <a href="{{factorPageCustomLinkHref}}" data-se="factor-page-custom-link" \
          class="link js-factor-page-custom-link" \
          rel="noopener noreferrer" target="_blank">\
          {{factorPageCustomLinkText}}\
        </a>\
      {{/if}}\
      {{#if showLink}}\
        <a href="#" class="link {{linkClassName}}" data-se="signout-link">\
          {{linkText}}\
        </a>\
      {{/if}}\
    '
  ),
  className: 'auth-footer clearfix',
  getTemplateData: function () {
    const signoutTemplateData = FooterSignout.prototype.getTemplateData.apply(this, arguments);
    const factorPageCustomLinkHref = this.settings.get('helpLinks.factorPageCustomLink.href');
    const factorPageCustomLinkText = this.settings.get('helpLinks.factorPageCustomLink.text');
    return Object.assign({}, signoutTemplateData, {
      hasFactorPageCustomLink: factorPageCustomLinkText && factorPageCustomLinkHref,
      factorPageCustomLinkHref,
      factorPageCustomLinkText,
      showLink: _.isUndefined(this.options.showLink) ? true : this.options.showLink,
    });
  },
});
