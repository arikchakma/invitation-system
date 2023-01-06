import React, { ReactElement } from "react";
import { MjmlSection, MjmlColumn, MjmlSpacer } from "mjml-react";
import { Template } from "mailing-core";
import Header from "./components/Header";
import Heading from "./components/Heading";
import Footer from "./components/Footer";
import Divider from "./components/Divider";
import Text from "./components/Text";
import BaseLayout from "./components/BaseLayout";
import { fontSize, spacing } from "./theme";

type NewSignInProps = {
  name: string;
  headline: string;
  body: ReactElement;
};

const NewSignIn: Template<NewSignInProps> = ({
  name,
  headline,
  body,
}) => {
  return (
    <BaseLayout width={352}>
      <Header />
      <MjmlSection cssClass="gutter">
        <MjmlColumn>
          <Divider paddingTop={spacing.s3} paddingBottom={spacing.s3} />
          <Heading
            paddingTop={spacing.s7}
            paddingBottom={spacing.s3}
            fontSize={fontSize.lg}
          >
            {headline}
          </Heading>
          <Text paddingTop={spacing.s5} paddingBottom={spacing.s5}>
            Hello {name},
          </Text>
          <Text>{body}</Text>
          <MjmlSpacer height={spacing.s5} />
          <Text paddingTop={spacing.s5} paddingBottom={spacing.s5}>
            ♥,
            <br />
            The Invoice System
          </Text>
          <Divider paddingTop={spacing.s5} paddingBottom={spacing.s5} />
        </MjmlColumn>
      </MjmlSection>
      <Footer includeUnsubscribe />
    </BaseLayout>
  );
};

export default NewSignIn;
