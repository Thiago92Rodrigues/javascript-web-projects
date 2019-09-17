

## JQuery

JQuery CDN ```https://code.jquery.com/jquery-3.4.1.min.js```
 
### Selectors

```js
$('*') // select everything on the page
$('h1') // select by element
$('#heading') // select by id
$('.container') // select by class
$(':button') // select by button type (button / submit / text)
$('[href]') // select all links on the page
$('[href="url"]') // select a specific href

// it's possible to nest elements
$('ul#list li:first') // select the first element of a list
$('ul#list li:last')
$('ul#list li:even') // select all the even elements of a list
$('ul#list li:odd')
$('ul#list li:nth-child(3)')

// examples
$('h1').hide();
$(':text').show();
$('ul#list li:nth-child(3)').css('list-style', 'none');
$('.container').css('background-color', 'red');
```

### Events
```js

$('#btn1').click(function(){});

$('#btn1').dblclick(function(){});

$('#btn1').hover(function(){});

$('#btn1').focus(function(){});

$('#btn1').blur(function(){});

$('#btn1').keyup(function(){});

.on('click', function(){});
.on('mouseenter', function(){});
.on('mouseleave', function(){});
.on('mousemove', function(){});
.on('mousedown', function(){});
.on('mouseup', function(){});

```
