'use client';

import { useEffect, useMemo } from 'react';
import { ForgottenPasswordFormClient } from './forgotten-password-form.client';
import { ResetPasswordFormClient } from './reset-password-form.client';
import { ResetPasswordEntity } from './reset-password.entity';
import { useSearchParams } from 'next/navigation';
import { getQueryParams } from '../common/query-params';
import { RestClient } from '../../rest-sdk/rest-client';
import { ResetPasswordViewProps } from './interfaces/reset-password.view-props';

const PasswordRecoveryQueryStringKey = 'vk';
export function ResetPasswordDefaultTemplate(props: ResetPasswordViewProps<ResetPasswordEntity>) {
    const labels = props.labels!;
    const context = props.widgetContext.requestContext;
    const propsClone = JSON.parse(JSON.stringify(props));

    const searchParams = useSearchParams();
    const queryParams = useMemo(() => {
      return getQueryParams(searchParams);
    }, [searchParams]);

    const isResetPasswordRequest = useMemo(() => {
        if (context.isLive) {
            if (queryParams[PasswordRecoveryQueryStringKey]) {
                return true;
            }
        }

        return false;
    }, [context, queryParams]);

    useEffect(() => {
      const queryList = new URLSearchParams(queryParams);
      const queryString = '?' + queryList.toString();
      propsClone.securityToken = queryString;

      if (isResetPasswordRequest) {
        propsClone.isResetPasswordRequest = true;

          RestClient.getResetPasswordModel(queryString).then(resetPasswordModel => {

            propsClone.requiresQuestionAndAnswer = resetPasswordModel.RequiresQuestionAndAnswer;
            propsClone.securityQuestion = resetPasswordModel.SecurityQuestion;
          }).catch(() => {
            // In terms of security, if there is some error with the user get, we display common error message to the user.
            propsClone.error = true;
          });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams, isResetPasswordRequest]);

    return (
      <>
        <div {...propsClone.attributes}>
          {propsClone.isResetPasswordRequest ?
            <div data-sf-role="sf-reset-password-container">
              {propsClone.error || (propsClone.requiresQuestionAndAnswer && !propsClone.securityQuestion) ?
                <>
                  <h2>{labels.resetPasswordHeader}</h2>
                  <div data-sf-role="error-message-container" className="alert alert-danger" role="alert" aria-live="assertive">{labels.errorMessage}</div>
                </>
                  :
                <ResetPasswordFormClient {...propsClone} />
                }
            </div>
          : <div data-sf-role="sf-forgotten-password-container">
            <h2 className="mb-3">{labels.forgottenPasswordHeader}</h2>
            <ForgottenPasswordFormClient {...propsClone} />
            {propsClone.loginPageUrl &&
              <a href={propsClone.loginPageUrl} className="text-decoration-none">{labels.backLinkLabel}</a>
            }
          </div>
          }
        </div>
      </>
    );
}
