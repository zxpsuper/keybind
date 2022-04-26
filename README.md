# keybind

Shortcut key combination library, make your keyboard key combination as easy to use as a publish-subscriber, subscribe and unsubscribe anywhere

快捷键组合库，让你的键盘组合键像发布订阅器一样简单使用，随处订阅和取消订阅

## Getting started

### use it in html

```html
<script src="https://unpkg.com/@suporka/keybind@1.0.1/lib/keybind.umd.js"></script> 
<script>
  keybind.bind('ctrl + s', function(event) {
    // do what you want to do
  }, context)
</script>
```
### use it by npm 

```
npm i @suporka/keybind --save
```

```ts
import keybind from '@suporka/keybind'
// bind one
keybind.bind('ctrl + s', function(event) {
  // do what you want to do
}, context)

// bind more
keybind.bind(['ctrl + s', 'shift + s'], function(event) {
  event.preventDefault()
  event.stopPropagation()
  // do what you want to do
}, context)

// unbind all
keybind.unbind('ctrl + s')

// unbind one by callback
keybind.unbind('ctrl + s', callback, context)
```
### Preventing the default action

```ts
keybind.bind('ctrl + s', function(event) {
  event.preventDefault()
  event.stopPropagation()
  // do what you want to do
}, context)
```


## Supported keys

- modifiers `shift`, `ctrl`, `alt`

- letters `a` to `z`

- numbers `0` to `9`

- functions `f1` to `f12`

- arrows `left`, `up`, `right`, `down`

- ohter `enter`, `esc`, `space`, `backspace`, `del`, `tab`, `pageup`, `pagedown`, `home`, `end`, `capslock`, `shift`, `ctrl`, `alt`, `ins`
- shiftkey `~` `!` `@` `#` `$` `%` `^` `&` `*` `(` `)` `_` `+` `:` `"` `<` `>` `?` `|`

## Questions or advise

If you have some question or advise, you can send me a E-mail，or create a [issue](https://github.com/zxpsuper/keybind/issues/new).