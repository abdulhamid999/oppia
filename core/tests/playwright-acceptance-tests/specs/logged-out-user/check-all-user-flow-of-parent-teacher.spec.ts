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
 * @fileoverview Acceptance Test for checking the user flow of Parent/Teachers
 */

import {test} from '@playwright/test';
import {UserFactory} from '../../utilities/common/user-factory';
import {LoggedOutUser} from '../../utilities/user/logged-out-user';
import testConstants from '../../utilities/common/test-constants';

const DEFAULT_SPEC_TIMEOUT_MSECS = testConstants.DEFAULT_SPEC_TIMEOUT_MSECS;

test.describe('Parent/Teacher', function () {
  let loggedOutUser: LoggedOutUser;

  test.beforeAll(async function ({browser}) {
    test.setTimeout(DEFAULT_SPEC_TIMEOUT_MSECS);
    loggedOutUser = await UserFactory.createLoggedOutUser(browser);
  });

  test(
    'should be able to navigate to "For Parent/Teacher page" via footer ' +
      'and click on "Explore Lessons" button',
    async function () {
      // Navigating to "For Parent/Teacher page" via footer from home page.
      await loggedOutUser.clickOnForParentsSlashTeachersLinkInFooter();

      // Navigating to "Parents/Teachers guide pdf" by clicking on the "Check out our guide" button.
      await loggedOutUser.verifyGuideButtonInTeachPage();
      // Navigating to "Teacher Story tagged blogs page" by clicking on the "Check out our blog" button.
      await loggedOutUser.clickAndVerifyBlogButtonInTeachPage();
      // Checking if the lesson creators carousel is working in the "For Parent/Teacher" page.
      await loggedOutUser.expectLessonCreatorsCarouselToBeFunctionalInTeachPage();
      // Navigating to "lesson creator's LinkedIn profile" by clicking on the "LinkedIn profile" button.
      await loggedOutUser.clickLinkedInButtonInTeachPage();
      // Checking if the lesson creation process is visible in the "For Parent/Teacher" page.
      await loggedOutUser.expectLessonCreationStepsAccordionToBeFunctionalInTeachPage();
      // Navigating to lessons/classroom page by clicking on the
      // "Explore Lessons" button on the "For Parent/Teacher" page.
      await loggedOutUser.clickExploreLessonsButtonAtTheTopInTeachPage();
      // Navigating back.
      await loggedOutUser.navigateToTeachPage();
      // Checking if the testimonials carousel is working in the "For Parent/Teacher" page.
      await loggedOutUser.expectTestimonailsCarouselToBeFunctionalInTeachPage();
      // Navigating to lessons/classroom page by clicking on the
      // "Explore Lessons" button on the "For Parent/Teacher" page.
      await loggedOutUser.clickExploreLessonsButtonAtTheBottomInTeachPage();
      // Navigating back.
      await loggedOutUser.navigateToTeachPage();
      // Navigating to "Android page" by clicking on the "Get Android App" button.
      await loggedOutUser.clickGetAndroidAppButtonInTeachPage();
    }
  );

  test.afterAll(async function () {
    await UserFactory.closeAllBrowsers();
  });
});
