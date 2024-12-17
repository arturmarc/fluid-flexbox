# flex-wrap-detector

### "`flex-wrap` on steroids" - detect and react to when flex items wrap

### a generic, pure js based custom element that detects when a flex-container children no longer fit in a single row

Can be used with any js framework or as a standalone custom element: `<flex-wrap-detector>`.

Uses same technique as the [react component](https://github.com/arturmarc/fluid-flexbox), but without react.

# `<flex-wrap-detector />`

### Checkout the live demo:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/html-examples/basic-usage.html)

## Installation

Install the package using npm or any other package manager

```bash
npm install fluid-flexbox
```

or

use a cdn

```html
<script src="https://unpkg.com/fluid-flexbox"></script>
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

Not just styling, but also content can be adapted. One simple way is fully specify alternative content using the `wrapped-content` slot.

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

Another way is to mutate the content using an event handler. Useful to overcome the limitations of the first approach.

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
    const child = e.detail.element.querySelector("#to-remove");
    if (child) {
      child.parentElement.removeChild(child);
    }
  });
  // !! make sure to call this after applying the listener
  // otherwise the changes won't get applied if the content is already wrapped
  detector.reApplyIfWrapped();
</script>
```

The event is fired when the content is wrapped, so it's possible to adjust the content using js and dom without recreating it. The event detail contains the element that was wrapped. \
The detector will automatically undo the changes when the content is no longer wrapped.

> note: This also has potential downsides. The obvious one is the need to use js to adjust the content. And another is if the content is also changing dynamically (or if the detectors are nested), it might have unexpected results.

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

As mentioned above when dynamically changing the detector's content .... todo - explain this
