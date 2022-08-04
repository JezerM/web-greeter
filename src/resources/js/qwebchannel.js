/****************************************************************************
 **
 ** Copyright (C) 2016 The Qt Company Ltd.
 ** Copyright (C) 2016 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
 ** Contact: https://www.qt.io/licensing/
 **
 ** This file is part of the QtWebChannel module of the Qt Toolkit.
 **
 ** $QT_BEGIN_LICENSE:LGPL$
 ** Commercial License Usage
 ** Licensees holding valid commercial Qt licenses may use this file in
 ** accordance with the commercial license agreement provided with the
 ** Software or, alternatively, in accordance with the terms contained in
 ** a written agreement between you and The Qt Company. For licensing terms
 ** and conditions see https://www.qt.io/terms-conditions. For further
 ** information use the contact form at https://www.qt.io/contact-us.
 **
 ** GNU Lesser General Public License Usage
 ** Alternatively, this file may be used under the terms of the GNU Lesser
 ** General Public License version 3 as published by the Free Software
 ** Foundation and appearing in the file LICENSE.LGPL3 included in the
 ** packaging of this file. Please review the following information to
 ** ensure the GNU Lesser General Public License version 3 requirements
 ** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
 **
 ** GNU General Public License Usage
 ** Alternatively, this file may be used under the terms of the GNU
 ** General Public License version 2.0 or (at your option) the GNU General
 ** Public license version 3 or any later version approved by the KDE Free
 ** Qt Foundation. The licenses are as published by the Free Software
 ** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
 ** included in the packaging of this file. Please review the following
 ** information to ensure the GNU General Public License requirements will
 ** be met: https://www.gnu.org/licenses/gpl-2.0.html and
 ** https://www.gnu.org/licenses/gpl-3.0.html.
 **
 ** $QT_END_LICENSE$
 **
 ****************************************************************************/

"use strict";

var QWebChannelMessageTypes = {
    signal: 1,
    propertyUpdate: 2,
    init: 3,
    idle: 4,
    debug: 5,
    invokeMethod: 6,
    connectToSignal: 7,
    disconnectFromSignal: 8,
    setProperty: 9,
    response: 10,
};

function getMessageTypeName(type) {
    switch (type) {
        case QWebChannelMessageTypes.signal:
            return "Signal";
        case QWebChannelMessageTypes.propertyUpdate:
            return "Property Update";
        case QWebChannelMessageTypes.init:
            return "Init";
        case QWebChannelMessageTypes.idle:
            return "Idle";
        case QWebChannelMessageTypes.debug:
            return "Debug";
        case QWebChannelMessageTypes.invokeMethod:
            return "Invoke Method";
        case QWebChannelMessageTypes.connectToSignal:
            return "Connect to Signal";
        case QWebChannelMessageTypes.disconnectFromSignal:
            return "Disconnect from Signal";
        case QWebChannelMessageTypes.setProperty:
            return "Set Property";
        case QWebChannelMessageTypes.response:
            return "Response";
        default:
            return "Unknown";
    }
}

class QObject {
    constructor(name, data, webChannel) {
        this.__id__ = name;
        webChannel.objects[name] = this;
        this.__objectSignals__ = {};
        this.__propertyCache__ = {};

        this._webChannel = webChannel;

        data.methods.forEach((data) => {
            this._addMethod(data);
        });
        data.properties.forEach((data) => {
            this._bindProperty(data);
        });
        data.signals.forEach((signal) => {
            this._addSignal(signal, false);
        });

        Object.assign(this, data.enums);
    }

    _unwrapQObject(response) {
        if (response instanceof Array) {
            return response.map((qobj) => this._unwrapQObject(qobj));
        }

        if (!(response instanceof Object)) return response;

        if (!response["__QObject*__"] || response.id === undefined) {
            let jObj = {};
            for (const propName of Object.keys(response)) {
                jObj[propName] = this._unwrapQObject(response[propName]);
            }
            return jObj;
        }

        const objectID = response.id;
        if (this._webChannel.objects[objectID]) return this._webChannel.objects[objectID];

        if (!response.data) {
            console.error("Cannot unwrap unknown QObject " + objectID + " without data.");
            return;
        }

        let qObject = new QObject(objectID, response.data, this._webChannel);
        qObject.destroyed.connect(function () {
            if (this._webChannel.objects[objectID] === qObject) {
                delete this._webChannel.objects[objectID];
                // reset the now deleted QObject to an empty {} object
                // just assigning {} though would not have the desired effect, but the
                // below also ensures all external references will see the empty map
                // NOTE: this detour is necessary to workaround QTBUG-40021
                Object.keys(qObject).forEach((name) => delete qObject[name]);
            }
        });
        // here we are already initialized, and thus must directly unwrap the properties
        qObject._unwrapProperties();
        return qObject;
    }

    _unwrapProperties() {
        for (const propInd of Object.keys(this.__propertyCache__)) {
            this.__propertyCache__[propInd] = this._unwrapQObject(this.__propertyCache__[propInd]);
        }
    }

    _propertyUpdate(signals, propertyMap) {
        for (const propInd of Object.keys(propertyMap)) {
            const propValue = propertyMap[propInd];
            this.__propertyCache__[propInd] = this._unwrapQObject(propValue);
        }

        for (const signalName of Object.keys(signals)) {
            this._invokeSignalCallbacks(signalName, signals[signalName]);
        }
    }

    _signalEmitted(signalName, signalArgs) {
        this._invokeSignalCallbacks(signalName, this._unwrapQObject(signalArgs));
    }

    _invokeSignalCallbacks(signalName, signalArgs) {
        const connections = this.__objectSignals__[signalName];
        if (connections) {
            connections.forEach((callback) => {
                callback.apply(callback, signalArgs);
            });
        }
    }

    _addMethod(methodData) {
        let methodName = methodData[0];
        let methodInd = methodData[1];

        let invokedMethod = methodName[methodName.length - 1] === ")" ? methodInd : methodName;

        this[methodName] = (...argumentos) => {
            let args = [];
            let callback;
            let errCallback;

            for (let i = 0; i < argumentos.length; i++) {
                let argument = argumentos[i];

                if (typeof argument === "function") callback = argument;
                else if (
                    argument instanceof QObject &&
                    this._webChannel.objects[argument.__id__] !== undefined
                ) {
                    args.push({
                        id: argument.__id__,
                    });
                } else {
                    args.push(argument);
                }
            }

            let result;

            // during test, webChannel.exec synchronously calls the callback
            // therefore, the promise must be constucted before calling
            // webChannel.exec to ensure the callback is set up
            if (!callback && typeof Promise === "function") {
                result = new Promise(function (resolve, reject) {
                    callback = resolve;
                    errCallback = reject;
                });
            }

            this._webChannel._exec(
                {
                    type: QWebChannelMessageTypes.invokeMethod,
                    object: this.__id__,
                    method: invokedMethod,
                    args: args,
                },
                (response) => {
                    if (response !== undefined) {
                        const result = this._unwrapQObject(response);
                        if (callback) {
                            callback(result);
                        }
                    } else if (errCallback) {
                        errCallback();
                    }
                }
            );

            return result;
        };
    }

    _bindProperty(propertyInfo) {
        let propInd = propertyInfo[0];
        let propName = propertyInfo[1];
        let notifySignalData = propertyInfo[2];

        this.__propertyCache__[propInd] = propertyInfo[3];

        if (notifySignalData) {
            if (notifySignalData[0] === 1) {
                // signal name is optimized away, reconstruct the actual name
                notifySignalData[0] = propName + "Changed";
            }
            this._addSignal(notifySignalData, true);
        }

        Object.defineProperty(this, propName, {
            configurable: true,
            get: () => {
                const propValue = this.__propertyCache__[propInd];
                if (propValue === undefined) {
                    // This shouldn't happen
                    console.warn(
                        'Undefined value in property cache for property "' +
                            propName +
                            '" in object ' +
                            this.__id__
                    );
                }
                return propValue;
            },
            set: (value) => {
                if (value === undefined) {
                    console.warn(
                        "Property setter for " + propName + " called with undefined value!"
                    );
                    return;
                }
                this.__propertyCache__[propInd] = value;
                let valueToSend = value;
                if (
                    valueToSend instanceof QObject &&
                    this._webChannel.objects[valueToSend.__id__] !== undefined
                )
                    valueToSend = { id: valueToSend.__id__ };
                this._webChannel._exec({
                    type: QWebChannelMessageTypes.setProperty,
                    object: this.__id__,
                    property: propInd,
                    value: valueToSend,
                });
            },
        });
    }

    _addSignal(signalData, isPropertyNotifySignal) {
        let signalName = signalData[0];
        let signalInd = signalData[1];

        this[signalName] = {
            connect: (callback) => {
                if (typeof callback !== "function") {
                    console.error("Bad callback given to connect to signal " + signalName);
                    return;
                }

                this.__objectSignals__[signalInd] = this.__objectSignals__[signalInd] || [];
                this.__objectSignals__[signalInd].push(callback);

                // only required for "pure" signals, handled separately for properties in propertyUpdate
                if (isPropertyNotifySignal) return;

                // also note that we always get notified about the destroyed signal
                if (
                    signalName === "destroyed" ||
                    signalName === "destroyed()" ||
                    signalName === "destroyed(QObject*)"
                )
                    return;

                // and otherwise we only need to be connected only once
                if (this.__objectSignals__[signalInd].length == 1) {
                    this._webChannel._exec({
                        type: QWebChannelMessageTypes.connectToSignal,
                        object: this.__id__,
                        signal: signalInd,
                    });
                }
            },
            disconnect: (callback) => {
                if (typeof callback !== "function") {
                    console.error("Bad callback given to disconnect from signal " + signalName);
                    return;
                }
                this.__objectSignals__[signalInd] = this.__objectSignals__[signalInd] || [];
                const idx = this.__objectSignals__[signalInd].indexOf(callback);
                if (idx === -1) {
                    console.error(
                        "Cannot find connection of signal " + signalName + " to " + callback.name
                    );
                    return;
                }
                this.__objectSignals__[signalInd].splice(idx, 1);
                if (!isPropertyNotifySignal && this.__objectSignals__[signalInd].length === 0) {
                    // only required for "pure" signals, handled separately for properties in propertyUpdate
                    this._webChannel._exec({
                        type: QWebChannelMessageTypes.disconnectFromSignal,
                        object: this.__id__,
                        signal: signalInd,
                    });
                }
            },
        };
    }
}

class QWebChannel {
    _execCallbacks = {};
    _execId = 0;
    objects = [];

    constructor(transport, initCallback) {
        if (typeof transport !== "object" || typeof transport.send !== "function") {
            console.error(
                `QWebChannel expects a transport object with a send function and onmessage callback property.` +
                    `Given is: transport: ${typeof transport}, transport.send: ${typeof transport.send}`
            );
            return;
        }

        this.transport = transport;
        this.initCallback = initCallback;

        this.transport.onmessage = (message) => {
            this._onMessage(message);
        };

        this._exec({ type: QWebChannelMessageTypes.init }, (data) => {
            for (const objectName of Object.keys(data)) {
                new QObject(objectName, data[objectName], this);
            }

            // now unwrap properties, which might reference other registered objects
            for (const objectName of Object.keys(this.objects)) {
                this.objects[objectName]._unwrapProperties();
            }

            if (this.initCallback) {
                this.initCallback(this);
            }
            this._exec({ type: QWebChannelMessageTypes.idle });
        });
    }

    _send(data) {
        if (typeof data !== "string") data = JSON.stringify(data);
        this.transport.send(data);
    }

    _onMessage(message) {
        let data = message.data;
        if (typeof data === "string") data = JSON.parse(data);

        switch (data.type) {
            case QWebChannelMessageTypes.signal:
                this._handleSignal(data);
                break;
            case QWebChannelMessageTypes.response:
                this._handleResponse(data);
                break;
            case QWebChannelMessageTypes.propertyUpdate:
                this._handlePropertyUpdate(data);
                break;
            default:
                console.error("invalid message received:", message.data);
                break;
        }
    }

    _handleSignal(message) {
        const object = this.objects[message.object];
        if (object) {
            object._signalEmitted(message.signal, message.args);
        } else {
            console.warn("Unhandled signal: " + message.object + "::" + message.signal);
        }
    }

    _handleResponse(message) {
        if (!message.hasOwnProperty("id")) {
            console.error("Invalid response message received: ", JSON.stringify(message));
            return;
        }
        const callback = this._execCallbacks[message.id];
        if (typeof callback !== "function" || callback === null) return;
        this._execCallbacks[message.id](message.data);
        delete this._execCallbacks[message.id];
    }

    _handlePropertyUpdate(message) {
        message.data.forEach((data) => {
            const object = this.objects[data.object];
            if (object) {
                object._propertyUpdate(data.signals, data.properties);
            } else {
                console.warn("Unhandled property update: " + data.object + "::" + data.signal);
            }
        });
        this._exec({ type: QWebChannelMessageTypes.idle });
    }

    _exec(data, callback) {
        if (!callback) {
            // if no callback is given, send directly
            this._send(data);
            return;
        }
        if (this._execId === Number.MAX_VALUE) {
            // wrap
            this._execId = Number.MIN_VALUE;
        }
        if (data.hasOwnProperty("id")) {
            console.error("Cannot exec message with property id: " + JSON.stringify(data));
            return;
        }
        data.id = this._execId++;
        this._execCallbacks[data.id] = callback;
        this._send(data);
    }
}

//required for use with nodejs
if (typeof module === "object") {
    module.exports = {
        QWebChannel: QWebChannel,
    };
}
