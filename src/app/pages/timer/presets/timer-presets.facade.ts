import { inject, Injectable, signal } from "@angular/core";
import { TimerPreset } from "../../../core/repositories/timer.repository";
import { TimerPresetsSvc } from "../../../services/timer-presets-svc";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Injectable({
    providedIn: 'root'
})
export class TimerPresetsFacade {
    readonly presetsSvc = inject(TimerPresetsSvc);

    readonly deleting = signal<TimerPreset | null>(null);
    readonly editing = signal<TimerPreset | null>(null);

    createPreset() {
        this.editing.set(this.presetsSvc.create());
    }

    editPreset(timer: TimerPreset) {
        this.editing.set(structuredClone(timer));
    }

    cancelEditing() {
        this.editing.set(null);
    }

    async savePreset(timer: TimerPreset) {
        await this.presetsSvc.save(timer);
        this.editing.set(null);
    }

    async deletePreset(id: string) {
        await this.presetsSvc.delete(id);
    }

    async toggleFavorite(timer: TimerPreset) {
        await this.presetsSvc.toggleFavorite(timer);
    }

    async showAll() {
        this.presetsSvc.filter.set('all');
    }

    async showFavorites() {
        this.presetsSvc.filter.set('favorite');
    }

    search(text: string) {
        this.presetsSvc.search.set(text);
    }

    searchChanged(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.search(value);
    }

    async reorder(event: CdkDragDrop<TimerPreset[]>) {
        if (event.previousIndex === event.currentIndex) return;

        await this.presetsSvc.reorder(
            event.previousIndex,
            event.currentIndex
        )
    }

    requestDelete(timer: TimerPreset) {
        this.deleting.set(timer);
    }

    cancelDelete() {
        this.deleting.set(null);
    }

    async confirmDelete() {
        const timer = this.deleting();
        if (!timer) return;

        await this.presetsSvc.delete(timer.id);
        this.deleting.set(null);
    }
}