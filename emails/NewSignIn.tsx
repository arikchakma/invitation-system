import React, { ReactElement } from 'react';
import { MjmlSection, MjmlColumn, MjmlSpacer } from 'mjml-react';
import { Template } from 'mailing-core';
import Header from './components/Header';
import Footer from './components/Footer';
import Divider from './components/Divider';
import Text from './components/Text';
import BaseLayout from './components/BaseLayout';
import { fontSize, spacing } from './theme';

type NewSignInProps = {
	headline: string;
};

const NewSignIn: Template<NewSignInProps> = ({ headline }) => {
	return (
		<BaseLayout width={352}>
			<Header title={headline} />
			<MjmlSection cssClass="gutter">
				<MjmlColumn>
					<Divider paddingTop={spacing.s3} paddingBottom={spacing.s3} />
					<Text paddingTop={spacing.s5} paddingBottom={spacing.s5}>
						Dear Buddy,
					</Text>
					<Text>
						Welcome to our app! We are so glad you have joined us. We hope you
						will find our app useful and enjoyable.
					</Text>

					<Text>
						To get started, we recommend exploring the different features and
						options available to you. If you have any questions or need help
						along the way, don&apos;t hesitate to reach out to our support team.
						They are always happy to assist you.
					</Text>

					<Text>
						We are constantly working to improve and update our app, so if you
						have any suggestions or feedback, we would love to hear from you.
					</Text>

					<Text>
						Thank you for choosing to use our app. We hope you have a great
						experience with us.
					</Text>
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
