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
 * @fileoverview Acceptance tests for the learner's journey from the last state/card of an exploration.
 * The tests include:
 * - Setup: Creation of exploration, topic, subtopic, skill, story, and classroom by a curriculum admin.
 * - User Journey: Navigation to classroom, selection of topic, completion of exploration by a logged-out user.
 * - Loading the next chapter, loading the practice session page, and returning to the story from the last state of an exploration.
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
  let explorationId1: string | null;
  let explorationId2: string | null;

  test.beforeAll(async function ({browser}) {
    test.setTimeout(600000);
    curriculumAdmin = await UserFactory.createNewUser(
      'curriculumAdm',
      'curriculumAdmin@example.com',
      browser,
      [ROLES.CURRICULUM_ADMIN]
    );

    explorationId1 =
      await curriculumAdmin.createAndPublishAMinimalExplorationWithTitle(
        'negative-numbers'
      );
    explorationId2 =
      await curriculumAdmin.createAndPublishAMinimalExplorationWithTitle(
        'positive-numbers',
        'Algebra',
        false
      );

    await curriculumAdmin.createAndPublishTopic(
      'Arithmetic',
      'Addition',
      'Multiplication',
      true
    );

    await curriculumAdmin.createAndPublishClassroom(
      'Math',
      'math',
      'Arithmetic'
    );

    await curriculumAdmin.addStoryToTopic(
      'Algebra Story 1',
      'algebra-story-one',
      'Arithmetic'
    );
    await curriculumAdmin.addChapter(
      'Algebra Chapter 1',
      explorationId1 as string
    );
    await curriculumAdmin.addChapter(
      'Algebra Chapter 2',
      explorationId2 as string
    );
    await curriculumAdmin.saveStoryDraft();
    await curriculumAdmin.publishStoryDraft();

    loggedOutUser = await UserFactory.createLoggedOutUser(browser);
  });

  test('should be able to return to the respective story, sign-in, sign-up and load the next chapter form the last state of an exploration', async function () {
    test.setTimeout(DEFAULT_SPEC_TIMEOUT_MSECS);
    await loggedOutUser.navigateToClassroomPage('math');

    await loggedOutUser.selectAndOpenTopic('Arithmetic');
    await loggedOutUser.selectChapterWithinStoryToLearn(
      'Algebra Story 1',
      'Algebra Chapter 1'
    );

    // Since the exploration has only one state, the learner should see the last state of the exploration immediately after selecting the chapter.
    await loggedOutUser.expectExplorationCompletionToastMessage(
      'Congratulations for completing this lesson!'
    );

    await loggedOutUser.expectSignUpButtonToBePresent();
    await loggedOutUser.expectSignInButtonToBePresent();

    await loggedOutUser.returnToStoryFromLastState();

    // Navigating back to the lesson's last state so to use the other options present onto that.
    await loggedOutUser.selectAndPlayChapter('Algebra Chapter 1');
    await loggedOutUser.loadNextChapterFromLastState();
  });

  test.afterAll(async function () {
    await UserFactory.closeAllBrowsers();
  });
});
