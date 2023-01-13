import { Template } from 'mailing-core';
import { Mjml, MjmlColumn, MjmlSection, MjmlSpacer } from 'mjml-react';
import BaseLayout from './components/BaseLayout';
import Divider from './components/Divider';
import Header from './components/Header';
import Text from './components/Text';
import { fontSize, spacing } from './theme';

type NewSignInProps = {
  headline: string;
};

const ReminderEmail: Template<NewSignInProps> = ({ headline }) => {
  return (
    <BaseLayout width={480}>
      <Header title={headline} />
      <MjmlSection cssClass="gutter">
        <MjmlColumn>
          <Divider paddingTop={spacing.s3} paddingBottom={spacing.s3} />
          <Text paddingTop={spacing.s5} paddingBottom={spacing.s5}>
            Dear Arikko,
          </Text>
          <Text>
            This is a reminder from your CRON job to check in and see if you
            were able to get some coding done today. Please let me know if you
            have made any progress or if you need any help or support.
          </Text>
          <MjmlSpacer height={spacing.s5} />
          <Text paddingTop={spacing.s5} paddingBottom={spacing.s5}>
            ♥,
            <br />
            The Arikko
          </Text>
          <Divider paddingTop={spacing.s5} paddingBottom={spacing.s5} />
        </MjmlColumn>
      </MjmlSection>
    </BaseLayout>
  );
};

export default ReminderEmail;
