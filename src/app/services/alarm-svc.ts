import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { Alarm, AlarmGroup, AlarmGroupView } from '../models/alarm.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlarmRepository } from '../core/repositories/alarm.repository';
import { AlarmEngine } from './alarm-engine';
import { AlarmScheduler } from './alarm-scheduler';

@Injectable({
  providedIn: 'root',
})
export class AlarmSvc {
  private readonly repo = inject(AlarmRepository);

  readonly alarms = signal<Alarm[]>([]);
  readonly loading = signal(false);
  readonly groups = signal<AlarmGroup[]>([]);

  private readonly scheduler = new AlarmScheduler();

  readonly groupViews = computed<AlarmGroupView[]>(() => {
    const alarms = this.alarms();
    const groups = [...this.groups()].sort((a, b) => a.order - b.order);
    const result: AlarmGroupView[] = [];
    const ungrouped = alarms
      .filter(a => a.groupId === null)
      .sort((a, b) => a.order - b.order)

    if (ungrouped.length) {
      result.push({
        id: null,
        title: 'ungrouped',
        expanded: true,
        system: true,
        alarms: ungrouped
      })
    }

    for (const group of groups) {
      result.push({
        id: group.id,
        title: group.title,
        expanded: group.expanded,
        system: false,
        alarms: alarms
          .filter(a => a.groupId === group.id)
          .sort((a, b) => a.order - b.order)
      })
    }

    return result;
  })

  private normalize(text: string) {
    return text.toLowerCase().replace(/\s+/g, '').replace(/:/g, '');
  }

  private timeVariants(hour: number, minute: number): string[] {
    const hh = hour.toString().padStart(2, '0');
    const mm = minute.toString().padStart(2, '0');

    return [
      `${hh}:${mm}`,
      `${hour}:${mm}`,
      `${hh}:${minute}`,
      `${hour}:${minute}`,
      `${hh}${mm}`,
      `${hour}${mm}`,
      `${hh}${minute}`,
      `${hour}${minute}`,
    ].map(v => this.normalize(v));

  }

  private matchesAlarm(alarm: Alarm, group: AlarmGroupView, query: string): boolean {
    const q = this.normalize(query);
    if (!q.length) return true;

    const title = this.normalize(alarm.title);
    const groupTitle = this.normalize(group.title);
    const repeat = this.normalize(alarm.repeat.join(' '));
    const timeMatches = this.timeVariants(alarm.hour, alarm.minute).some(time => time.includes(q));

    return (
      title.includes(q) ||
      groupTitle.includes(q) ||
      repeat.includes(q) ||
      timeMatches
    );

  }

  filteredGroupViews(search: Signal<string>) {
    return computed(() => {
      const query = search().trim();
      if (!query.length) return this.groupViews();

      return this.groupViews().map(group => ({
        ...group,
        alarms: group.alarms.filter(alarm => {
          return this.matchesAlarm(alarm, group, query)
        })
      })).filter(group => group.alarms.length)
    })
  }

  readonly nextAlarm = computed(() => {
    return this.scheduler.nextAlarm(this.alarms());
  })

  constructor() {
    void this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const data = await this.repo.load();
      this.groups.set(data.groups);
      this.alarms.set(data.alarms);
    }
    finally {
      this.loading.set(false);
    }
  }

  private async persist() {
    await this.repo.save({
      groups: this.groups(),
      alarms: this.alarms()
    })
  }

  async saveAlarm(alarm: Alarm) {
    const alarms = [...this.alarms()];
    const index = alarms.findIndex(a => a.id === alarm.id);

    alarm.updatedAt = Date.now();

    if (index >= 0) {
      alarms[index] = structuredClone(alarm);
    } else {
      alarms.push(structuredClone(alarm));
    }

    this.alarms.set(alarms);
    await this.persist();
  }

  async deleteAlarm(id: string) {
    this.alarms.update(list => list.filter(a => a.id !== id));
    await this.persist();
  }

  async toggleAlarm(alarm: Alarm) {
    this.alarms.update(list => list.map(a =>
      a.id === alarm.id ? {
        ...a,
        enabled: !a.enabled,
        updatedAt: Date.now()
      } : a
    ))

    await this.persist();
  }

  async reorderAlarm(event: CdkDragDrop<Alarm[]>) {
    const alarms = [...this.alarms()];

    moveItemInArray(
      alarms,
      event.previousIndex,
      event.currentIndex
    )

    alarms.forEach((alarm, index) => {
      alarm.order = index;
      alarm.updatedAt = Date.now();
    })

    this.alarms.set(alarms);
    await this.persist();
  }

  createAlarm(): Alarm {
    return {
      id: crypto.randomUUID(),
      groupId: null,
      title: 'new alarm',
      hour: 0,
      minute: 0,
      enabled: true,
      repeat: [],
      sound: 'alarm',
      order: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  }

  async disableAlarm(id: string) {
    this.alarms.update(list =>
      list.map(alarm =>
        alarm.id === id ?
          {
            ...alarm,
            enabled: false,
            updatedAt: Date.now()

          }
          : alarm
      )
    )

    await this.persist();
  }

  async duplicateAlarm(alarm: Alarm): Promise<Alarm> {
    const copy: Alarm = {
      ...structuredClone(alarm),
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: `${alarm.title} copy`
    }

    this.alarms.update(list => [...list, copy]);
    await this.persist();
    return copy;
  }

  async createGroup() {
    const groups = [...this.groups()];

    groups.push({
      id: crypto.randomUUID(),
      title: `Group ${groups.length + 1}`,
      color: 'transparent',
      order: groups.length,
      expanded: true
    })

    this.groups.set(groups);
    await this.persist();
  }

  async renameGroup(group: AlarmGroup, title: string) {
    this.groups.update(list => list.map(g =>
      g.id === group.id ? {
        ...g,
        title
      } : g
    ))

    await this.persist();
  }

  async deleteGroup(id: string) {
    this.groups.update(list => list
      .filter(g => g.id !== id)
      .map((g, index) => ({
        ...g,
        order: index
      }))
    )

    this.alarms.update(list => list.map(a =>
      a.groupId === id ? {
        ...a,
        groupId: null,
        updatedAt: Date.now()
      } : a
    ))

    await this.persist();
  }

  async moveAlarmToGroup(alarm: Alarm, groupId: string | null) {
    this.alarms.update(list => list.map(a =>
      a.id === alarm.id ? {
        ...a,
        groupId,
        updatedAt: Date.now()
      } : a
    ))

    await this.persist();
  }

  async toggleGroup(group: AlarmGroup) {
    this.groups.update(list => list.map(g =>
      g.id === group.id ? {
        ...g,
        expanded: !g.expanded
      } : g
    ))

    await this.persist();
  }

  getGroup(id: string | null) {
    if (id === null) return null;
    return this.groups().find(g => g.id === id) ?? null;
  }

  readonly ungroupedAlarms = computed(() => this.alarms()
    .filter(a => a.groupId === null)
    .sort((a, b) => a.order - b.order)
  )

  readonly groupedAlarms = computed(() => {
    const alarms = this.alarms();
    return this.groups()
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(group => ({
        group,
        alarm: alarms
          .filter(a => a.groupId === group.id)
          .sort((a, b) => a.order - b.order)
      }))
  })
}
