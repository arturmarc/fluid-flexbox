# fluid-flexbox

### a "`flex-wrap` on steroids"

React component that detects when it's flex children no longer fit in a single row.
Allows styles and content to dynamically adapt the space available.

Powerful tool for responsive layout that enables responsive styling not based on pixel sizes but on the available space. For example:

<img src="/public/images/BasicExample.gif" style="height: 12rem" alt="Basic usage demo gif" />

- uses css flexbox model and extends it
- entirely dynamic (no calculations involved) adapts to any change in content, parent css etc..
- can be nested (deeply if needed) to create complex responsive rules
- not just styling, but also content can be easily adapted using a render prop or the `useFluidFlexboxWrapped` hook
- resilient to infinite render loops
- works with any css framework (tailwind, bootstrap, etc) or inline styles

and ...

# flex-wrap-detector

### a generic, pure js based custom element

Can be used with any js framework or as a standalone custom element: `<flex-wrap-detector>`.

[see full documentation](./flex-wrap-detector/README.md)

- Uses same technique as the react component, but without react.
- Faster and lighter than the react component, but more cumbersome to use when adapting content.
- can be difficult to use when working with dynamically changing content

<br><br>

## `<FluidFlexbox />` - react component

### Checkout the live demo:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/BasicUsageExample.tsx)

## Installation

Just install the package using npm or any other package manager:

```bash
npm install fluid-flexbox
```

and import

```js
import { FluidFlexBox } from "fluid-flexbox";
```

## Basic usage

Use the `wrappedClass` prop to add a css class when flex content is wrapped (no longer fits in a single row)

<img src="/public/images/BasicExample.gif" style="height: 12rem" alt="Basic usage demo gif" />

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/BasicUsageExample.tsx)

```jsx
import { FluidFlexbox } from "fluid-flexbox";

<FluidFlexbox className="gap-2" wrappedClass="flex-col">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</FluidFlexbox>;
```

This example showcases a simple but useful use case: changing the layout of a toolbar when buttons no longer fit in a single row and renders them in a column instead.

> note: all examples are using [tailwind css utility classes](), If you're unfamiliar, Tailwind functions work similarly to inline styles. For example `flex-col` is equivalent to `style="flex-direction: column"`, just applied using an utility class

## Adapting content

<img src="/public/images/AdaptingContentExample.gif" style="height: 12rem" alt="Adapting content demo gif" />

Not just styling, but also content can be easily adapted using render prop:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/AdaptingContentExample.tsx)

```jsx
<FluidFlexbox className="gap-2">
  {(isWrapped) => (
    <>
      <Button>Remove</Button>
      <Button>Extra</Button>
      {!isWrapped && <Button>Button</Button>}
    </>
  )}
</FluidFlexbox>
```

or using the `useFluidFlexboxWrapped` hook:

```jsx
import { FluidFlexbox, useFluidFlexboxWrapped } from "fluid-flexbox";

function Buttons() {
  const isWrapped = useFluidFlexboxWrapped();
  return (
    <>
      <Button>Remove</Button>
      <Button>Extra</Button>
      {!isWrapped && <Button>Button</Button>}
    </>
  );
}

function Toolbar() {
  return (
    <FluidFlexbox className="gap-2">
      <Buttons />
    </FluidFlexbox>
  );
}
```

## Nesting

Two levels of nesting. \
This example example demonstrates how fluid flex-boxes can be nested. \
It also showcases fluid flexbox being able to grow by using `containerClassName="flex-grow"`.

<img src="/public/images/NestedExample.gif" style="height: 12rem" alt="Two levels of nesting demo gif" />

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/NestedExample.tsx)

```jsx
<FluidFlexbox
  className="w-full gap-2"
  wrappedClass="flex-col bg-red-300/25"
  containerClassName="w-full"
>
  {(isWrapped) => (
    <>
      <FluidFlexbox
        className="justify-between gap-2"
        wrappedClass="flex-col"
        containerClassName="flex-grow"
      >
        <Button className="flex-1">{isWrapped ? "Wrapped" : "First"}</Button>
        <Button className="flex-1">Second</Button>
      </FluidFlexbox>
      <FluidFlexbox
        className="flex justify-between gap-2"
        wrappedClass="flex-col"
        containerClassName="flex-grow"
      >
        <Button className="flex-1">Third</Button>
        <Button className="flex-1">Fourth</Button>
      </FluidFlexbox>
    </>
  )}
</FluidFlexbox>
```

Conditionally nested - if the widest content is wrapped, checks if the narrower version is wrapped to enable
eventually rendering the narrower version.

<img src="/public/images/ConditionallyNestedExample.gif" style="height: 8rem" alt="Conditionally nested demo gif" />

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/ConditionallyNestedExample.tsx)

```jsx
const contentWhenWidest = (
  <>
    <Button>Longer</Button>
    <Button>Button</Button>
    <Button>Labels</Button>
  </>
);
const contentWhenNarrower = (
  <>
    <Button>Shrt</Button>
    <Button>But</Button>
    <Button>Lbl</Button>
  </>
);
const narrowestContent = (
  <>
    <Button className="flex-grow p-0.5">
      <BookIcon size="20" />
    </Button>
    <Button className="flex-grow p-0.5">
      <FileIcon size="20" />
    </Button>
    <Button className="flex-grow p-0.5">
      <PanelBottomIcon size="20" />
    </Button>
  </>
);
return (
  <FluidFlexbox className="gap-2" containerClassName="overflow-hidden">
    {(isWidestWrapped) =>
      !isWidestWrapped ? (
        contentWhenWidest
      ) : (
        <FluidFlexbox className="gap-2" wrappedClass="gap-1">
          {(isNarrowerWrapped) =>
            !isNarrowerWrapped ? contentWhenNarrower : narrowestContent
          }
        </FluidFlexbox>
      )
    }
  </FluidFlexbox>
);
```

Deep nesting:\
This example demonstrates how elements can be changed one by one to replace text labels with icons.

<img src="/public/images/DeepNestingExample.gif" style="height: 8rem" alt="Deep nesting demo gif" />

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/DeepNestingExample.tsx)

```jsx
<FluidFlexbox className="gap-2">
  {(outerIsWrapped) => (
    <>
      <Button> {outerIsWrapped ? <XIcon size="20" /> : "Close"}</Button>
      <FluidFlexbox className="gap-2">
        {(innerIsWrapped) => (
          <>
            <Button> {innerIsWrapped ? <PlusIcon size="20" /> : "New"}</Button>
            <FluidFlexbox>
              {(innermostIsWrapped) => (
                <>
                  <Button>
                    {innermostIsWrapped ? <TrashIcon size="20" /> : "Delete"}
                  </Button>
                  <div className="h-[1px]"></div>
                </>
              )}
            </FluidFlexbox>
          </>
        )}
      </FluidFlexbox>
    </>
  )}
</FluidFlexbox>
```

## Single child

Can also be used to detect if a single element is overflowing it's container using this trick:

<img src="/public/images/SingleChildExample.gif" style="height: 8rem" alt="Single child demo gif" />

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/SingleChildExample.tsx)

```jsx
<FluidFlexbox>
  {(isWrapped) => (
    <>
      <Button>{isWrapped ? <StopCircle /> : "Long button"}</Button>
      <div className="h-[1px]"></div>
    </>
  )}
</FluidFlexbox>
```

(..TODO advanced consideration: inside a flex container, and infinite loop)

## Additional props

- `wrappedClass` - css class to add when flex content is wrapped
- `wrappedStyle` - css style to add when flex content is wrapped
- `containerClassName` - css class to add to the container element (the flexbox element is wrapped in a div that you might want to style using this prop)
- `throttleTime` - throttles the detection of overflowing content. Default is no throttling
- `hidden` - convenience prop to hide the element (applying `display: none` to the FluidFlexbox component does not work)
- `removeClassWhenWrapped` - when set tot true `wrappedClass` replaces the `className` prop instead of adding to it. Default is false
- `containerStyle` - css style to add to the container element (the flexbox element is wrapped in a div that you might want to style using this prop)

# How it works and important considerations

FluidFlexbox works by rendering two hidden clones of it's original content to detect when the flex items would wrap.

With that comes an important consideration: \n
this library might not work well near the root of a large component tree.
It's probably at it's best when used for toolbars, menus or content blocks.

### Why two clones?

They are basically identical copies of the flex container with differing values of the `flex-wrap` property.
Then a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver)
[use-resize-observer](https://github.com/ZeeCoder/use-resize-observer) is used to trigger measurements that determine whether the flex-items wrap or not.
The clones are rendering the _original_, not wrapped version of the content (`isWrapped = false`) and the `wrappedClass` not added.
That way `FluidFlexbox` can know if the original content would fit again when the alternative version is rendered (`isWrapped = true`).

### Infinite loops

If the alternative styling or content when `<FluidFlexbox>` is wrapped is actually making it _grow_ to fit the original non wrapped content again, it is possible to get into an infinite loop. There is a built in protection against this, but it's not perfect and it will still cause multiple re-renders and flashes. The protection is timing based so depending on how fast the re-rendering is it might not trigger. \
Take care to adjust your wrapped styling and content to not cause that infinite loop. It's usually a mistake anyway since the whole point is to adjust your content and styling to fit better when original content is wrapped which means making the content smaller. \
The `<flex-wrap-detector>` handles infinite loops much better, so consider using it if you have serious problem with them in the react version.
