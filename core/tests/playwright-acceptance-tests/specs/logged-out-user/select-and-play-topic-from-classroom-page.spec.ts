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
 * @fileoverview Acceptance Test for the learner journey in the math classroom.
 * The test includes:
 * - Setup: Creation of exploration, topic, subtopic, skill, story, and classroom by a curriculum admin.
 * - User Journey: Navigation to classroom, selection of topic, completion of exploration, and review of a card by a logged-out user.
 */

import {test} from '@playwright/test';
import {UserFactory} from '../../utilities/common/user-factory';
import testConstants from '../../utilities/common/test-constants';
import {LoggedOutUser} from '../../utilities/user/logged-out-user';
import {ExplorationEditor} from '../../utilities/user/exploration-editor';
import {CurriculumAdmin} from '../../utilities/user/curriculum-admin';

const DEFAULT_SPEC_TIMEOUT_MSECS = testConstants.DEFAULT_SPEC_TIMEOUT_MSECS;
const ROLES = testConstants.Roles;

test.describe('Logged-out User', function () {
  let curriculumAdmin: CurriculumAdmin & ExplorationEditor;
  let loggedOutUser: LoggedOutUser;
  let explorationId: string | null;

  test.beforeAll(async function ({browser}) {
    test.setTimeout(900000);
    loggedOutUser = await UserFactory.createLoggedOutUser(browser);

    curriculumAdmin = await UserFactory.createNewUser(
      'curriculumAdm',
      'curriculumAdmin@example.com',
      browser,
      [ROLES.CURRICULUM_ADMIN]
    );

    explorationId =
      await curriculumAdmin.createAndPublishAMinimalExplorationWithTitle(
        'Negative Numbers'
      );

    await curriculumAdmin.createAndPublishTopic(
      'Algebra I',
      'Negative Numbers',
      'Negative Numbers',
      true
    );

    await curriculumAdmin.createAndPublishClassroom(
      'Math',
      'math',
      'Algebra I'
    );

    await curriculumAdmin.createAndPublishStoryWithChapter(
      'Algebra Story',
      'algebra-story',
      'Understanding Negative Numbers',
      explorationId as string,
      'Algebra I'
    );
  });

  test('should be able to select and play a topic from the classroom page', async function () {
    test.setTimeout(DEFAULT_SPEC_TIMEOUT_MSECS);
    await loggedOutUser.navigateToClassroomPage('math');
    await loggedOutUser.expectTopicsToBePresent(['Algebra I']);

    await loggedOutUser.selectAndOpenTopic('Algebra I');
    await loggedOutUser.selectChapterWithinStoryToLearn(
      'Algebra Story',
      'Understanding Negative Numbers'
    );

    // Check for the completion message as the exploration has a single state.
    await loggedOutUser.expectExplorationCompletionToastMessage(
      'Congratulations for completing this lesson!'
    );

    // Returning to the topic page from the exploration player itself.
    await loggedOutUser.returnToTopicPageAfterCompletingExploration();
    await loggedOutUser.navigateToStudyTab();

    // Review cards are the subtopic that are created in the topic.
    await loggedOutUser.selectReviewCardToLearn('Negative Numbers');
    await loggedOutUser.expectReviewCardToHaveContent(
      'Negative Numbers',
      'Subtopic creation description text for Negative Numbers'
    );
  });

  test.afterAll(async function () {
    await UserFactory.closeAllBrowsers();
  });
});
