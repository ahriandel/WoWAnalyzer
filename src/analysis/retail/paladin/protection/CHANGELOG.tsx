import { change, date } from 'common/changelog';
import { emallson, Heisenburger, ToppleTheNun, Woliance } from 'CONTRIBUTORS';

// prettier-ignore
export default [
  change(date(2023, 7, 9), 'Updating Grand Crusader and Implementing the Tier 30 4 set bonus', Woliance),
  change(date(2023, 7, 3), 'Update SpellLink usage.', ToppleTheNun),
  change(date(2023, 3, 26), 'Fix crashes related to 10.0.7 talent changes', emallson),
  change(date(2023, 1, 13), <>Initial updates to support dragonflight talent/spell changes, if I couldn't make it work or it didn't seem needed I took it out for now. Mostly basic updates to accomodate for baseline spells that became talents, etc. Truncated changelog.</>, Heisenburger),
];
