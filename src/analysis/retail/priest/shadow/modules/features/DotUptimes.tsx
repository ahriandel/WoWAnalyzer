import Analyzer from 'parser/core/Analyzer';
import StatisticBar from 'parser/ui/StatisticBar';
import { STATISTIC_ORDER } from 'parser/ui/StatisticsListBox';

import { SpellLink } from 'interface';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/priest';

import DevouringPlague from '../spells/DevouringPlague';
import ShadowWordPain from '../spells/ShadowWordPain';
import VampiricTouch from '../spells/VampiricTouch';
import DarkEvangelism from '../talents/DarkEvangelism';

import { explanationAndDataSubsection } from 'interface/guide/components/ExplanationRow';
import { RoundedPanel } from 'interface/guide/components/GuideDivs';

class DotUptimes extends Analyzer {
  static dependencies = {
    vampiricTouch: VampiricTouch,
    shadowWordPain: ShadowWordPain,
    devouringPlague: DevouringPlague,
    darkEvangelism: DarkEvangelism,
  };
  protected vampiricTouch!: VampiricTouch;
  protected shadowWordPain!: ShadowWordPain;
  protected devouringPlague!: DevouringPlague;
  protected darkEvangelism!: DarkEvangelism;

  statistic() {
    return (
      <StatisticBar wide position={STATISTIC_ORDER.CORE(1)}>
        {this.vampiricTouch.subStatistic()}
        {this.shadowWordPain.subStatistic()}
        {this.devouringPlague.subStatistic()}
        {this.darkEvangelism.active && this.darkEvangelism.subStatistic()}
      </StatisticBar>
    );
  }

  get guideSubsection() {
    const explanation = (
      <p>
        <b>
          Keep your DoTs up on the boss. <br />
        </b>
        In addition to dealing damage, <SpellLink spell={SPELLS.VAMPIRIC_TOUCH} /> and{' '}
        <SpellLink spell={SPELLS.SHADOW_WORD_PAIN} />, increase all your damage through{' '}
        <SpellLink spell={SPELLS.MASTERY_SHADOW_WEAVING} />.
      </p>
    );

    const data = (
      <RoundedPanel>
        {this.vampiricTouch.subStatistic()}
        {this.shadowWordPain.subStatistic()}
      </RoundedPanel>
    );

    return explanationAndDataSubsection(explanation, data);
  }

  get guideSubsectionDP() {
    const explanation = (
      <p>
        <b>
          Maximize the uptime of <SpellLink spell={TALENTS.DEVOURING_PLAGUE_TALENT} /> while not
          wasting insanity.
        </b>
        <br />
        Unlike most DoTs when reapplied, any remaining damage will be added to the new effect. In
        addition to dealing damage, it increases all your damage through{' '}
        <SpellLink spell={SPELLS.MASTERY_SHADOW_WEAVING} />.
      </p>
    );

    const data = <RoundedPanel>{this.devouringPlague.subStatistic()}</RoundedPanel>;

    return explanationAndDataSubsection(explanation, data);
  }

  get guideSubsectionDE() {
    const explanation = (
      <p>
        This is the uptime of <SpellLink spell={SPELLS.DARK_EVANGELISM_TALENT_BUFF} />. You should
        not adjust your rotation to maintain this buff.
      </p>
    );

    const data = (
      <RoundedPanel>
        {this.darkEvangelism.active && this.darkEvangelism.subStatistic()}
      </RoundedPanel>
    );

    return explanationAndDataSubsection(explanation, data);
  }
}

export default DotUptimes;
