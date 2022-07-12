/*
 * GreeterComm.js
 *
 * Copyright © 2022 JezerM
 *
 * This file is part of Web Greeter.
 *
 * Web Greeter is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * Web Greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with web-greeter; If not, see <http://www.gnu.org/licenses/>.
 */

function inf_to_infinity(num) {
    if (num === "infinity") return Infinity;
    else if (num === "-infinity") return -Infinity;
    else return num;
}

class GreeterComm {
    static _instance = null;

    constructor(instance) {
        if (GreeterComm._instance !== null) {
            return GreeterComm._instance;
        }

        GreeterComm._instance = instance;
        GreeterComm._instance.broadcast_signal.connect(this._on_broadcast);
    }

    get window_metadata() {
        let meta = GreeterComm._instance.window_metadata;
        if (Object.keys(meta).length == 0) {
            throw new Error(
                `window_metadata not available, did you wait for the GreeterReady event?`
            );
        }
        meta.overallBoundary.minX = inf_to_infinity(meta.overallBoundary.minX);
        meta.overallBoundary.minY = inf_to_infinity(meta.overallBoundary.minY);
        meta.overallBoundary.maxX = inf_to_infinity(meta.overallBoundary.maxX);
        meta.overallBoundary.maxY = inf_to_infinity(meta.overallBoundary.maxY);
        return meta;
    }

    broadcast(data) {
        GreeterComm._instance.broadcast(data);
    }

    _on_broadcast(window_meta, data) {
        const event = new Event("GreeterBroadcastEvent");
        event.window = window_meta;
        event.data = data;
        window.dispatchEvent(event);
    }
}
