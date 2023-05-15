# Changelog

All notable changes to this project will be documented in this file.

The Format is based on all commits made to this repository using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

## [Unreleased]

- feat(panel): Migrate to Next.js Appdir
- chore: Update dependencies

## [0.0.6] - 2023-03-04
- chore: Lint fixing
- fix: Change file type for /embed/avatars/X to png
- chore(Web): Update Mantine to version 6
- fix(Storage): Create missing Playlist table in Migration1 controller
- fix(Web): Allow EVE Admins to access any server

[0.0.6]:https://github.com/Its-treason/eve/compare/0.0.5...0.0.6


## [0.0.5] - 2023-03-01
- fix(Web): Fix styling of goto user input
- feat(Web): Show all server for admins
- fix(Bot): Fix name for skipped track not being hightlighted properly
- feat(panel): Improve UI of Public-Logs
- fix(Bot): Fix Public Logs Subscriptions not working
- fix(Bot): Improve logging of native actions
- chore: Update README

[0.0.5]:https://github.com/Its-treason/eve/compare/0.0.4...0.0.5


## [0.0.4] - 2023-02-24
- fix(migration): Create empty role-menus index
- fix(bot): Role menu roles not beign removed properly
- feat(bot): Log native ban / kick / pardon actions
- feat: Log more events
- feat!: Remove old storage package
- chore: Extends Readme with documention for setup
- feat(storage): Better migration scripts for setting up the project

[0.0.4]:https://github.com/Its-treason/eve/compare/0.0.3...0.0.4


## [0.0.3] - 2023-02-13
- fix: Various smaller fixes
- chore: Fix linting issues in project
- fix(panel): Allow bind dev-server to 0.0.0.0 instead of just localhost
- chore: Update all project dependencies to newes version
- feat: Add Glass effect to prominent buttons
- feat: Implement log subscriptions to channel
- feat!: Rename AutoActions to ServerSettings
- feat(panel): Fix validation for auto actions and improve ui
- fix(bot): Validate Bot started correctly and is connected
- feat(panel): Add filter to Server-logs
- feat: Add PublicLogs
- chore: Upgrade dependencies
- perf: Only validate changes for embed and role-menus on blur
- feat: Update RoleMenuRepository to save into ES
- feat: Add storage-migration project for automatic storage-migration
- feat(panel): Allow Drag'n'Drop of role menu buttons
- feat(panel): Add frontend validation for role menu form
- feat(bot): Add RemoveRoleCommand and update AddRoleCommand

[0.0.3]:https://github.com/Its-treason/eve/compare/0.0.2...0.0.3


## [0.0.2] - 2022-09-26
- feat(bot): Add add_roles command
- fix(bot): Fix Auto-Actions not being executed due to missing intends
- chore: User runtime variable in panel & docker-compose version
- feat(panel+api): Add Embeds for role menus
- chore: Migrate the panel from vite to next.js
- chore: Update docker build
- fix(bot): Minor fixes with Validation CoR

[0.0.2]:https://github.com/Its-treason/eve/compare/0.0.0...0.0.2

