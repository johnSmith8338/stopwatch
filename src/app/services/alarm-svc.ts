import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Alarm, AlarmGroup, AlarmGroupView } from '../models/alarm.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlarmRepository } from '../core/repositories/alarm.repository';
import { AlarmEngine } from './alarm-engine';

@Injectable({
  providedIn: 'root',
})
export class AlarmSvc {
  private readonly repo = inject(AlarmRepository);

  readonly alarms = signal<Alarm[]>([]);
  readonly loading = signal(false);
  readonly groups = signal<AlarmGroup[]>([]);

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
      snoozeMinutes: 5,
      order: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
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
