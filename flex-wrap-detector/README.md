# flex-wrap-detector

### "`flex-wrap` on steroids" - detect and react to when flex items wrap

### a generic, pure js based custom element that detects when a flex-container children no longer fit in a single row

Can be used with any js framework or as a standalone custom element: `<flex-wrap-detector>`.

Uses same technique as the [react component](https://github.com/arturmarc/fluid-flexbox), but without react.

## `<flex-wrap-detector>`

### Checkout the live demo:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/basic-usage.html)

## Installation

Install the package using npm or any other package manager

```bash
npm install fluid-flexbox
```

then import it like this

```js
import "fluid-flexbox/flex-wrap-detector";
```

or use a cdn

```html
<script src="https://unpkg.com/fluid-flexbox@latest/dist/web/flex-wrap-detector.umd.js"></script>
```

## Basic usage

It is a custom element that needs to wrap a single child, that will become a flex row container (if it is not already).

Use the `wrapped-class` attribute to add a css class when flex content of the detector child is wrapped (no longer fits in a single row)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/basic-usage.html)

```html
<flex-wrap-detector wrapped-class="flex-col">
  <div class="flex gap-2">
    <div class="button-example">First</div>
    <div class="button-example">Second</div>
    <div class="button-example">Third</div>
  </div>
</flex-wrap-detector>
```

This example showcases a simple but useful use case: changing the layout of a toolbar when buttons no longer fit in a single row and renders then in a column instead.

> note: all examples are using [tailwind css utility classes](), If you're unfamiliar, Tailwind functions work similarly to inline styles. For example `flex-col` is equivalent to `style="flex-direction: column"`, just applied using an utility class

## Adapting content - alternative content

Not just styling, but also content can be adapted. One simple way is to fully specify alternative content using the `wrapped-content` slot.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/adapting-content.html)

```html
<flex-wrap-detector>
  <div class="flex gap-2">
    <div class="button-example">Remove</div>
    <div class="button-example">Extra</div>
    <div class="button-example">Button</div>
  </div>
  <div slot="wrapped-content" class="flex-col gap-2">
    <div class="button-example">Remove</div>
    <div class="button-example">Extra</div>
  </div>
</flex-wrap-detector>
```

> note: This has two potential downsides: 1. All the alternative content needs to be fully specified in the html, which might be cumbersome especially when only a small part of the content is different. 2. The alternative content is actually completely different html, so any state like input values will be lost when wrapping.

## Adapting content - mutating content

Another way is to adjust the content using an event handler. Useful to overcome the limitations of the first approach.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/adapting-content-mutating.html)

```html
<flex-wrap-detector id="detector">
  <div class="flex items-center gap-2">
    <div class="button-example">Input's</div>
    <input
      class="input-example"
      type="text"
      placeholder="state will be preserved"
    />
    <div class="button-example" id="to-remove">Removable</div>
  </div>
</flex-wrap-detector>
<script>
  const detector = document.querySelector("#detector");
  detector.addEventListener("set-wrapped-content", (e) => {
    e.detail.element.querySelector("#to-remove").remove();
  });
  // !! make sure to call this after applying the listener
  // otherwise the changes won't get applied if the content is already wrapped
  detector.reApplyIfWrapped();
</script>
```

The `set-wrapped-content` event is fired when the content is wrapped. It allows to adjust the content using js and dom without recreating it. The event detail contains the element that was wrapped. \
The detector will automatically undo the changes when the content is no longer wrapped.

This is very useful especially when there are stateful ui elements inside the detector. It means that the elements and their state can be preserved when the content is adjusted (not just replaced with a different element like in the example above).

This is also how the `wrapped-class` attribute works internally.

> note: This approach still has potential downsides. The obvious one is the need to use js to adjust the content. And another is, if the content is also changing dynamically (if the detectors are nested for example), it might have unexpected results (See [below](#dynamic-content) for an in depth explanation).

## Nesting

Nesting is possible and works well with slot based approach to adapting content.

See nested examples in stackblitz:

- [two levels of nesting](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/two-levels-nesting.html)
- [conditionally nested](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/conditionally-nested.html)
- [deep nesting](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/deep-nesting.html)

With the second abroach (using 'set-wrapped-content' event), or by using just 'wrapped-class' attribute, there might be some unexpected results when the content is nested. In general it can work, but issues might occur and a warning might be shown (which can be suppressed using 'suppress-warning' attribute). Best to carefully test your use case.

## Single child

Can also be used to detect if a single element is overflowing it's container using this trick:

```html
<flex-wrap-detector>
  <div>
    <div class="button-example">Long button</div>
    <div class="h-[1px]"></div>
  </div>
  <div slot="wrapped-content">
    <div class="button-example">
      <stop-circle />
    </div>
  </div>
</flex-wrap-detector>
```

This is pretty useful cause it don't really need to be multiple flex children, and can just tell if a single child is overflowing it's container.

This technique can lean to some involved layouts like the one in the [holy grail toolbar example](https://github.com/arturmarc/fluid-flexbox/blob/main/src/usage/examples/HolyGrailToolbarExample.tsx).

## Dynamic content

### tldr

Dynamically changing the detector's content might break it when the alternative wrapped content is already applied. When you see this warning in the console make sure to test if the behavior is what you expect. If it is not, you can use the "wrapped-content" slot and change both copies of the content (original child and the slotted child).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/dynamic-content.html)

### Deep dive

As mentioned above when dynamically changing the detector's content there are caveats to consider when _not_ using the "wrapped-content" slot (so when using wrapped-class and/or set-wrapped-content event). \
The problem is what happens when the content is changed dynamically when the alternative wrapped content is already applied. The detector keeps a copy of a non-wrapped/original content, but the dynamic change will not be applied to that copy. \
To explain [the example](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/dynamic-content.html) - there are two buttons, that currently don't fit and have `flex: column` direction applied using 'wrapped-class' attribute. Say an unrelated user action causes one of those buttons to be removed. That change will not be applied to the detector's copy of the content, so the detector will still think that there are two buttons and not unwrap the content even if it now fits. \
There will be a warning in the console when that happens to inform you that the detector might not be fully functional. \
The easy solution is to use "wrapped-content" slot and change both copies of the content (original child and the slotted child).
A more involved one, when this is not preferable is to actually reach into detector's internals on also mutate it's invisible copies.

All of this is not ideal, but the detector version is meant to be used in more static contexts, so this should not be a common concern.

Interestingly the React version `<FluidFlexbox>` does not have that problem at all, because its trivial to re-render the copy thanks to React's virtual-dom. To duplicate that capability in a vanilla js solution would require essentially building a small rendering engine that can would need to have some of the React capabilities.
