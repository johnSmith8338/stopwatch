import { Injectable } from "@angular/core";
import { TimerColor } from "../../constants/colors";
import { TimerIcon } from "../../constants/icons";
import { TimerSound } from "../../services/sound-svc";

export interface TimerSettings {
    color: TimerColor;
    icon: TimerIcon;
    sound: TimerSound;
}

@Injectable({
    providedIn: 'root'
})

export class TimerSettingsRepository { }