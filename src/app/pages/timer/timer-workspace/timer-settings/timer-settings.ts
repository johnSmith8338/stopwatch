import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SoundPicker } from "../../../../components/sound-picker/sound-picker";
import { TimerSettingsSvc } from '../../../../services/timer-settings-svc';
import { TimerColor } from '../../../../constants/colors';
import { TimerIcon } from '../../../../constants/icons';
import { TimerSound } from '../../../../services/sound-svc';
import { ColorPicker } from "../../../../components/color-picker/color-picker";
import { IconPicker } from "../../../../components/icon-picker/icon-picker";

@Component({
  selector: 'app-timer-settings',
  imports: [SoundPicker, ColorPicker, IconPicker],
  templateUrl: './timer-settings.html',
  styleUrl: './timer-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerSettings {
  readonly svc = inject(TimerSettingsSvc);

  readonly settings = computed(() => this.svc.settings());

  setColor(color: TimerColor) {
    void this.svc.patch({ color });
  }

  setIcon(icon: TimerIcon) {
    void this.svc.patch({ icon });
  }

  setSound(sound: TimerSound) {
    void this.svc.patch({ sound });
  }
}
