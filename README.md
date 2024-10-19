# fluid-flexbox

### a "`flex-wrap` on steroids"

React component that detects when it's flex children no longer fit in a single row.
Allows styles and content to dynamically adapt the space available.

Powerful responsive layout tool that enables responsive styling not based on pixel sizes but on the available space.

- uses css flexbox model and extends it
- entirely dynamic (no calculations involved) adapts to any change in content, parent css etc..
- can be nested (deeply if needed) to create complex responsive rules
- not just styling, but also content can be easily adapted using render prop or the `useFluidFlexboxWrapped` hook
- resilient to infinite render loops
- works with any css framework (tailwind, bootstrap, etc) or inline styes

and ...

# flex-wrap-detector

### a generic, pure js based custom element

Can be used with any js framework or as a standalone custom element: `<flex-wrap-detector>`.

- Uses same technique as the react component, but without react.
- Faster and lighter than the react component. But more cumbersome to use, when adapting content.
- (TODO fix this using mutation reverser ?) less capable when adapting content, it copies that content, so input state would be lost for example

# <FluidFlexbox />

### Checkout the live demo:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/BasicUsageExample.tsx)

## Basic usage

Use the `wrappedClass` prop to add a css class when flex content is wrapped (no longer fits in a single row)

<img src="/public/images/BasicExample.gif" style="height: 16rem" alt="Basic usage demo gif" />

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/arturmarc/fluid-flexbox?file=src/usage/examples/BasicUsageExample.tsx)

```jsx
<FluidFlexbox className="gap-2" wrappedClass="flex-col">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</FluidFlexbox>
```

This example showcases probably a most useful simple usage. Changes the layout of a toolbar when buttons no longer fit in a single row and renders then in a column instead.

> note: all examples are using [tailwind css utility classes](), if you are not familiar, it's functionally very similar to using inline styles. For example `flex-col` is equivalent to `style="flex-direction: column"`, just applied using an utility class

## Adapting content

<img src="/public/images/AdaptingContentExample.gif" style="height: 16rem" alt="Adapting content demo gif" />

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

, or using the `useFluidFlexboxWrapped` hook:

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
In this example there is also a nested flex container and growing content.

[gif]

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

Conditionally nested

[gif]

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
    {(isOverflowing) =>
      !isOverflowing ? (
        contentWhenWidest
      ) : (
        <FluidFlexbox className="gap-2" wrappedClass="gap-1">
          {(narrowerIsOverflowing) =>
            !narrowerIsOverflowing ? contentWhenNarrower : narrowestContent
          }
        </FluidFlexbox>
      )
    }
  </FluidFlexbox>
);
```

Deep nesting - changing elements one by one

[gif]

```jsx
<FluidFlexbox className="gap-2">
  {(isOverflowing) => (
    <>
      <Button> {isOverflowing ? <XIcon size="20" /> : "Close"}</Button>
      <FluidFlexbox className="gap-2">
        {(isOverflowing) => (
          <>
            <Button> {isOverflowing ? <PlusIcon size="20" /> : "New"}</Button>
            <FluidFlexbox>
              {(isOverflowing) => (
                <>
                  <Button>
                    {isOverflowing ? <TrashIcon size="20" /> : "Delete"}
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

Can also be used to detect if a single element is overflowing using this trick

[gif]

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

## Additional props

- `wrappedClass` - css class to add when flex content is wrapped
- `wrappedStyle` - css style to add when flex content is wrapped
- `throttleTime` - throttles the detection of overflowing content. Default is no throttling
- `hidden` - convenience prop to hide the element (applying `display: none` tot the FluidFlexbox component does not work)
- `containerClassName` - css class to add to the container element (the flexbox element is wrapped in a div that you might want to style using this prop)
- (TODO) `removeClassWhenWrapped` - when set tot true `wrappedClass` replaces the `className` prop instead of adding to it. Default is false

# How it works and important considerations

FluidFlexbox works by rendering two hidden clones of it's original content to detect when the flex items would wrap.

With that comes an important consideration: \n
this library might not work well near the root of a large component tree.
It's probably at it's best when used for toolbars, menus or content blocks.

### Why two clones?

They are basically identical copies of the flex container with differing values of the `flex-wrap` property.
Then a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver)
(use-resize-observer) is used to trigger measurements that determine whether the flex-items wrap or not.
The clones are rending the _original_ not wrapped version of the content (`isWrapped = false`) and the `wrappedClass` not added.
That way `FluidFlexbox` can know if the original content would fit again when the alternative version is rendered (isWrapped = true).
