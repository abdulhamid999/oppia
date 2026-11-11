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
 * @fileoverview Acceptance test for checking the behavior of the classroom index page
 * for 0 classrooms, 1 classroom, and more than 1 classroom.
 */

import {test} from '@playwright/test';
import testConstants from '../../utilities/common/test-constants';
import {UserFactory} from '../../utilities/common/user-factory';
import {LoggedOutUser} from '../../utilities/user/logged-out-user';
import {CurriculumAdmin} from '../../utilities/user/curriculum-admin';

const ROLES = testConstants.Roles;

test.describe.configure({mode: 'serial'});

test.describe('Logged-out User', function () {
  let loggedOutUser: LoggedOutUser;
  let curriculumAdmin: CurriculumAdmin;

  test.beforeAll(async function ({browser}) {
    test.setTimeout(480000);
    loggedOutUser = await UserFactory.createLoggedOutUser(browser);
    curriculumAdmin = await UserFactory.createNewUser(
      'curriculumAdm',
      'curriculum_admin@example.com',
      browser,
      [ROLES.CURRICULUM_ADMIN]
    );
    await curriculumAdmin.createTopic('Test Topic 2', 'test-topic-two', true);
    await curriculumAdmin.createTopic('Test Topic 1', 'test-topic-one');
  });

  test('should be redirected to a 404 error page if no classrooms are present.', async function () {
    await loggedOutUser.navigateToClassroomsPage(false);
    await loggedOutUser.expectToBeOnErrorPage(404);
  });

  test('should be redirected to a classroom page if we have 1 public classroom.', async function () {
    test.setTimeout(480000);
    await curriculumAdmin.navigateToTopicAndSkillsDashboardPage();
    await curriculumAdmin.createNewClassroom('Math', 'math');
    await curriculumAdmin.updateClassroom(
      'Math',
      'Welcome to Math classroom!',
      'This course covers basic algebra and trigonometry.',
      'In this course, you will learn the following topics: algbera and trigonometry,'
    );
    await curriculumAdmin.addTopicToClassroom('Math', 'Test Topic 1');
    await curriculumAdmin.publishClassroom('Math');

    await loggedOutUser.navigateToClassroomsPage(false);
    await loggedOutUser.expectToBeOnClassroomPage('Math');
  });

  test('should show classrooms page with classroom cards.', async function () {
    test.setTimeout(480000);
    await curriculumAdmin.navigateToTopicAndSkillsDashboardPage();
    await curriculumAdmin.createNewClassroom('Science', 'science');
    await curriculumAdmin.updateClassroom(
      'Science',
      'Welcome to Science classroom!',
      'This course covers basic physics and chemistry.',
      'In this course, you will learn the following topics: physics and chemistry,'
    );
    await curriculumAdmin.addTopicToClassroom('Science', 'Test Topic 2');
    await curriculumAdmin.publishClassroom('Science');

    await loggedOutUser.navigateToClassroomsPage(false);
    await loggedOutUser.expectClassroomCountInClassroomsPageToBe(2);
  });

  test.afterAll(async function () {
    await UserFactory.closeAllBrowsers();
  });
});
