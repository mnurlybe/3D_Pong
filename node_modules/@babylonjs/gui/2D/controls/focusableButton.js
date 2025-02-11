import { Button } from "./button.js";
import { RegisterClass } from "@babylonjs/core/Misc/typeStore.js";
/**
 * Class used to create a focusable button that can easily handle keyboard events
 * @since 5.0.0
 */
export class FocusableButton extends Button {
    constructor(name) {
        super(name);
        this.name = name;
        this._unfocusedColor = this.color;
    }
    /**
     * @internal
     */
    _onPointerDown(target, coordinates, pointerId, buttonIndex, pi) {
        if (!this.isReadOnly) {
            // Clicking on button should focus
            this.focus();
        }
        return super._onPointerDown(target, coordinates, pointerId, buttonIndex, pi);
    }
}
RegisterClass("BABYLON.GUI.FocusableButton", FocusableButton);
//# sourceMappingURL=focusableButton.js.map