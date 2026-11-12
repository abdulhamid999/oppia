// Copyright 2026 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Acceptance Test for checking the user flow of Partners
 */

import {test} from '@playwright/test';
import {UserFactory} from '../../utilities/common/user-factory';
import {LoggedOutUser} from '../../utilities/user/logged-out-user';
import testConstants from '../../utilities/common/test-constants';

const DEFAULT_SPEC_TIMEOUT_MSECS = testConstants.DEFAULT_SPEC_TIMEOUT_MSECS;

test.describe('Partner', function () {
  let loggedOutUser: LoggedOutUser;

  test.beforeAll(async function ({browser}) {
    test.setTimeout(DEFAULT_SPEC_TIMEOUT_MSECS);
    loggedOutUser = await UserFactory.createLoggedOutUser(browser);
  });

  test(
    'should be able to navigate to partnerships page when started from home page ' +
      'and open the partnerships form in partnerships page.',
    async function () {
      // Navigating to About page via navbar from home page.
      await loggedOutUser.clickAboutButtonInAboutMenuOnNavbar();
      // Navigating back to home page for the next test.
      await loggedOutUser.navigateToHome();
      // Navigating to About page via footer from home page.
      await loggedOutUser.clickOnAboutLinkInFooter();

      // Opening the Impact report by clicking on the "View Impact Report" button on the About page.
      await loggedOutUser.clickViewReportButtonInAboutPage();

      // Opening the Partnerships form by clicking on the "Partner with us" button of Partner tab on the About page.
      await loggedOutUser.clickPartnerWithUsButtonInAboutPage();
      // Opening the partnerships form by clicking the "Partner with us" button of Partner tab on the About page.
      // after changing the language to Portuguese.
      await loggedOutUser.clickPartnerWithUsButtonInAboutPageInGivenLanguage(
        'pt-br'
      );
      // Navigating to the Partnerships page by clicking on the Learn More button of Partner tab.
      await loggedOutUser.clickPartnerLearnMoreButtonInAboutPage();

      // Opening the partnerships form by clicking the "Partner with us" button at the top of the partnerships page.
      await loggedOutUser.clickPartnerWithUsButtonInPartnershipsPage();
      // Opening the partnerships form by clicking the "Partner with us" button at the bottom
      // of the partnerships page after changing the language to Portuguese.
      await loggedOutUser.clickPartnerWithUsButtonInPartnershipsPageInGivenLanguage(
        'pt-br'
      );
    }
  );

  test.afterAll(async function () {
    await UserFactory.closeAllBrowsers();
  });
});
