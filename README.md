# Ryan2.0
MVVM framework Ryan2.0 
simple but high performance,suitable for small projects.

## Not Supported
IE(all version)

### Test

#### HTML
&lt;div id="app"&gt;<br>
  &nbsp;&nbsp;&lt;div&gt;{{a.b}}&lt;/div&gt;<br>
  &nbsp;&nbsp;&lt;input type="text" r-model="a.b"&gt;<br>
  &nbsp;&nbsp;&lt;div&gt;{{a.c.d}}&lt;/div&gt;<br>
  &nbsp;&nbsp;&lt;input type="text" r-model="a.c.d"&gt;<br>
  &nbsp;&nbsp;&lt;div&gt;{{e}}&lt;/div&gt;<br>
  &nbsp;&nbsp;&lt;input type="text" r-model="e"&gt;<br>
&lt;/div&gt;

#### Javascript
new Ryan({<br>
&nbsp;&nbsp;  el : '#app',<br>
&nbsp;&nbsp;  data : {<br>
&nbsp;&nbsp;&nbsp;&nbsp;    a : {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      b : 123,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      c : {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        d : 321,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      },<br>
&nbsp;&nbsp;&nbsp;&nbsp;    },<br>
&nbsp;&nbsp;&nbsp;&nbsp;    e : 'abc',<br>
&nbsp;&nbsp;  }<br>
})
