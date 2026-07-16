import { computed, inject, Injectable, signal } from "@angular/core";
import { TimerPreset } from "../../../core/repositories/timer.repository";
import { TimerPresetsSvc } from "../../../services/timer-presets-svc";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { TimerWorkspaceFacade } from "../timer-workspace/timer-workspace.facade";

@Injectable({
    providedIn: 'root'
})
export class TimerPresetsFacade {
    readonly presetsSvc = inject(TimerPresetsSvc);
    readonly workspace = inject(TimerWorkspaceFacade);

    readonly deleting = signal<TimerPreset | null>(null);
    readonly editorOpened = signal(false);

    readonly timers = computed(() => this.presetsSvc.presets.value() ?? []);
    readonly loading = computed(() => this.presetsSvc.presets.isLoading());

    openEditor() {
        this.editorOpened.set(true);
    }

    closeEditor() {
        this.editorOpened.set(false);
    }

    createPreset() {
        const preset = this.presetsSvc.create();
        this.workspace.loadPreset(preset);
        this.openEditor();
    }

    editPreset(timer: TimerPreset) {
        this.workspace.loadPreset(structuredClone(timer));
        this.openEditor();
    }

    cancelEditing() {
        this.workspace.reset();
        this.closeEditor();
    }

    async savePreset() {
        const preset = this.workspace.draft.activePreset();
        if (!preset) return;

        await this.presetsSvc.save(preset);
        this.workspace.draft.clear();
        this.closeEditor();
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
        await this.presetsSvc.reorder(event);
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