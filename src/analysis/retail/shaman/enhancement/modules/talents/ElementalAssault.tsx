import SPELLS from 'common/SPELLS';
import { TALENTS_SHAMAN } from 'common/TALENTS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import { calculateEffectiveDamage } from 'parser/core/EventCalculateLib';
import Events, { DamageEvent } from 'parser/core/Events';
import ItemDamageDone from 'parser/ui/ItemDamageDone';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

import { STORMSTRIKE_DAMAGE_SPELLS } from '../../constants';
import TalentSpellText from 'parser/ui/TalentSpellText';

const ELEMENTAL_ASSAULT_RANKS: Record<number, number> = {
  1: 0.1,
  2: 0.2,
};

const MAIN_HAND_DAMAGES = [SPELLS.STORMSTRIKE_DAMAGE.id, SPELLS.WINDSTRIKE_DAMAGE.id];

/**
 * Stormstrike damage is increased by [10/20]%, and Stormstrike
 * has a [50/100]% chance to generate 1 stack of Maelstrom Weapon.
 *
 * Example Log:
 *
 */
class ElementalAssault extends Analyzer {
  protected damageIncrease: number = 0;
  protected damageGained: number = 0;
  protected maelstromWeaponGained: number = 0;
  protected maelstromWeaponWasted: number = 0;

  constructor(options: Options) {
    super(options);

    this.active = this.selectedCombatant.hasTalent(TALENTS_SHAMAN.ELEMENTAL_ASSAULT_TALENT);

    if (!this.active) {
      return;
    }

    this.damageIncrease =
      ELEMENTAL_ASSAULT_RANKS[
        this.selectedCombatant.getTalentRank(TALENTS_SHAMAN.ELEMENTAL_ASSAULT_TALENT)
      ];

    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(STORMSTRIKE_DAMAGE_SPELLS),
      this.onStormstrikeDamage,
    );
  }

  onStormstrikeDamage(event: DamageEvent): void {
    this.damageGained += calculateEffectiveDamage(event, this.damageIncrease);

    // Use main-hand to determine gained maelstrom weapon stacks, which should catch MW gained from Stormflurry also
    if (MAIN_HAND_DAMAGES.includes(event.ability.guid)) {
      this.maelstromWeaponGained += 1;
    }

    const maelstromWeaponBuff = this.selectedCombatant.getBuff(SPELLS.MAELSTROM_WEAPON_BUFF.id);
    if (maelstromWeaponBuff?.stacks === 10) {
      this.maelstromWeaponWasted += 1;
    }
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL()}
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        tooltip={
          <>
            <div>{this.maelstromWeaponGained} Total Maelstrom Gained</div>
            <div>{this.maelstromWeaponWasted} Maelstrom Wasted</div>
            <hr />
            <div>
              {this.maelstromWeaponGained - this.maelstromWeaponWasted} Effective Maelstrom Gained
            </div>
          </>
        }
      >
        <TalentSpellText talent={TALENTS_SHAMAN.ELEMENTAL_ASSAULT_TALENT}>
          <>
            <ItemDamageDone amount={this.damageGained} />
          </>
        </TalentSpellText>
      </Statistic>
    );
  }
}

export default ElementalAssault;
