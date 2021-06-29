<a id="LightDM.Signal"></a>

## LightDM.Signal
Interface for signals connected to LightDM itself. This is not created by the theme's code, but rather by Web Greeter.
When Web Greeter triggers the signal, all calbacks are executed.

<a id="LightDM.Signal+connect"></a>

### signal.connect(callback)
Connects a callback to the signal.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback to attach. |

<a id="LightDM.Signal+disconnect"></a>

### signal.disconnect(callback)
Disconnects a callback to the signal.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback to disattach. |

