---
name: add-role
description: Add a new optional role to Palermo (like the Doctor or the Informant), from types and role assignment through the settings toggle, both languages, night narration and tests. Use when asked to add, design or implement a new role or character.
---

# Add an optional role

Optional roles are switched on in the settings modal and dealt at the start of a game. The Doctor is the best existing example to copy, because it touches every layer: search the repo for `DOCTOR` and `doctorEnabled` before you start.

If the role's rules are not fully specified (what it does at night, which side it is on, how many players it needs), ask the user before writing code. House rules for Palermo vary a lot.

## Steps

1. **Types** in `lib/game-types.ts`:
   - add the role to the `Role` union
   - add it to `ROLE_FACTIONS` (`'good'` or `'killer'`) and `ROLE_MESSAGE_KEYS`
   - add an `<role>Enabled` boolean to `GameSettings` and set it to `false` in `DEFAULT_SETTINGS`
   - raise the minimum in `getMinPlayers` so at least one citizen is always left
2. **Dealing** in `lib/role-assignment.ts`: push the role when its setting is on, next to the Doctor and the Informant.
3. **Winning** in `lib/win-conditions.ts`: killers are matched by role name. If the new role is on the killer side, add it there.
4. **Night actions**: if the role acts at night, give the reducer an action, or extend `ANNOUNCE_VICTIM`, in `lib/game-reducer.ts`. Add the step in `components/game/night-kill-phase.tsx` or `night-intro-phase.tsx`, and only run it while the role's player is alive. See `doctorAlive` for the pattern.
5. **Text** in both `assets/messages/en.json` and `assets/messages/el.json`:
   - `role.<name>.name` and `role.<name>.desc`
   - `settings.<name>`, `settings.<name>Desc`, `settings.<name>Min`
   - any `narration.<name>Wake` and `narration.<name>Sleep` lines
6. **Settings toggle**: add an entry to the `ROLES` array in `components/game/settings-modal.tsx`.
7. **Narration audio**: add the keys to `NarrationKeys` and `NARRATION_MAP` in `lib/narration.ts`. If there are recorded clips, put them in `assets/audio/en/` and `assets/audio/el/` and add a `require()` line to both audio maps. If there are no clips yet, say so in the pull request. The narration still shows as on-screen text on a timer.
8. **Tests** in `__tests__/`:
   - role-assignment: the role is dealt exactly once when enabled and never when disabled
   - `getMinPlayers` returns the new minimum
   - win conditions count the role on the right side
   - a reducer test for any new night action

## Check

```bash
npm test && npm run lint && npx tsc --noEmit
```

Then play one game in the app with the role switched on, in both languages, and confirm the role shows up on reveal and its night step runs.
