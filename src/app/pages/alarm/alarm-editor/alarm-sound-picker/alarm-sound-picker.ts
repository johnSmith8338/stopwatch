import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';
import { SoundSvc, TimerSound } from '../../../../services/sound-svc';
import { SheetSelectItem, SheetSelect } from '../../../../components/sheet-select/sheet-select';

@Component({
  selector: 'app-alarm-sound-picker',
  imports: [SheetSelect],
  templateUrl: './alarm-sound-picker.html',
  styleUrl: './alarm-sound-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmSoundPicker {
  private readonly workspace = inject(AlarmWorkspaceFacade);
  private readonly soundSvc = inject(SoundSvc);

  readonly draft = this.workspace.draft;

  readonly opened = signal(false);

  readonly items = computed<SheetSelectItem<TimerSound>[]>(() => [
    {
      id: 'none',
      title: 'Silent'
    },
    {
      id: 'ding',
      title: 'Ding'
    },
    {
      id: 'alarm',
      title: 'Alarm'
    }
  ]);

  change(sound: TimerSound) {
    this.draft.updateSound(sound);
    this.soundSvc.preview(sound);
  }
}
