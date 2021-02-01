import { loc, View } from 'okta';
import hbs from 'handlebars-inline-precompile';
import BaseForm from '../../internals/BaseForm';
import BaseView from '../../internals/BaseView';
import BaseAuthenticatorView from '../../components/BaseAuthenticatorView';
import AuthenticatorEnrollFooter from '../../components/AuthenticatorEnrollFooter';
import EnrollGoogleAuthenticatorBarcodeView from './EnrollGoogleAuthenticatorBarcodeView';
import EnrollAuthenticatorManualSetupView from './EnrollAuthenticatorManualSetupView';
import { addCustomButton } from '../../internals/FormInputFactory';

const VIEW_TO_DISPLAY = 'viewToDisplay';
const viewToDisplayState = {
  BARCODE: 'barcode',
  MANUAL: 'manual',
  ENTER_CODE: 'enterCode',
};

const Body = BaseForm.extend({
  title () {
    return loc('oie.enroll.google_authenticator.setup.title', 'login');
  },

  noButtonBar: true,

  className: 'oie-enroll-google-authenticator',

  enterCodeSubtitle: View.extend({
    template: hbs`
      <div class="google-authenticator-setup-info-title enter-code-title">
      {{i18n code="oie.enroll.google_authenticator.enterCode.title" bundle="login"}}
      </div>
    `,
  }),

  getUISchema () {
    const schema = BaseForm.prototype.getUISchema.apply(this, arguments);

    const nextButton = addCustomButton({
      className: 'google-authenticator-next',
      title: loc('oform.next', 'login'),
      attributes: {
        style: 'display: block',
      },
      click: () => {
        this.model.set(VIEW_TO_DISPLAY, viewToDisplayState.ENTER_CODE);
      }
    });

    const verifyButton = addCustomButton({
      className: 'google-authenticator-verify',
      title: loc('oform.verify', 'login'),
      click: () => {
        this.$el.submit();
      }
    });

    schema[0].showWhen = {
      viewToDisplay: viewToDisplayState.ENTER_CODE,
    };

    // Add Enter Code Subtitle
    schema.unshift({
      View: this.enterCodeSubtitle,
      selector: '.o-form-fieldset-container',
    });

    schema.push(
      {
        View: EnrollGoogleAuthenticatorBarcodeView,
        selector: '.o-form-fieldset-container',
        showWhen: {
          viewToDisplay: viewToDisplayState.BARCODE,
        }
      }, {
        View: EnrollAuthenticatorManualSetupView,
        selector: '.o-form-fieldset-container',
        showWhen: {
          viewToDisplay: viewToDisplayState.MANUAL,
        }
      }, {
        label: false,
        className: 'shared-secret',
        type: 'text',
        placeholder: this.options.appState.get('currentAuthenticator').contextualData.sharedSecret,
        disabled: true,
        showWhen: {
          viewToDisplay: viewToDisplayState.MANUAL,
        }
      },
      {
        View: nextButton,
        showWhen: {
          viewToDisplay: (val) => val === viewToDisplayState.BARCODE || val === viewToDisplayState.MANUAL,
        }
      },
      {
        View: verifyButton,
        showWhen: {
          viewToDisplay: (val) => val === viewToDisplayState.ENTER_CODE,
        }
      },
    );
    return schema;
  },
});

export default BaseAuthenticatorView.extend({
  Body,
  Footer: AuthenticatorEnrollFooter,
  createModelClass () {
    const ModelClass = BaseView.prototype.createModelClass.apply(this, arguments);
    const local = Object.assign(
      {
        viewToDisplay: {
          value: 'barcode',
          type: 'string',
          required: true,
          values: [viewToDisplayState.BARCODE, viewToDisplayState.MANUAL, viewToDisplayState.ENTER_CODE],
        }
      },
      ModelClass.prototype.local,
    );
    return ModelClass.extend({
      local,
    });
  },
});