<a id="LightDM_Signal"></a>

## LightDM.Signal
Interface for signals connected to LightDM itself. This is not created by the theme's code, but rather by Web Greeter.
When Web Greeter triggers the signal, all calbacks are executed.

<a id="LightDM_Signal-connect"></a>

### signal.connect(callback)
Connects a callback to the signal.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>callback</td><td><code>function</code></td><td><p>The callback to attach.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Signal-disconnect"></a>

### signal.disconnect(callback)
Disconnects a callback to the signal.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>callback</td><td><code>function</code></td><td><p>The callback to disattach.</p>
</td>
    </tr>  </tbody>
</table>

