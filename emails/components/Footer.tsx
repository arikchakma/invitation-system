import React from 'react';
import { EMAIL_PREFERENCES_URL } from 'mailing-core';
import { MjmlColumn, MjmlSection, MjmlText } from 'mjml-react';
import { colors, fontSize, spacing } from '../theme';

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export default function Footer(
  { includeUnsubscribe }: FooterProps = {
    includeUnsubscribe: false,
  }
) {
  return (
    <MjmlSection cssClass="gutter">
      <MjmlColumn>
        <MjmlText
          paddingTop={spacing.s9}
          paddingBottom={spacing.s10}
          fontSize={fontSize.sm}
          color={colors.neutral400}
        >
          © {new Date().getFullYear()} Arikko
          {includeUnsubscribe && (
            <>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a
                href={EMAIL_PREFERENCES_URL}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                Unsubscribe
              </a>
            </>
          )}
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
}
