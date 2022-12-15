import {
  Accessor,
  Component,
  ComponentProps,
  createEffect,
  createSignal,
  For,
  JSX,
  on
} from "solid-js";
import { Dynamic } from "solid-js/web";
import Sortable from "sortablejs";

interface WrapperProps {
  ref<E extends HTMLElement>(element: E): void;
}
interface SortableProps<
  W extends Component<WrapperProps> | keyof JSX.IntrinsicElements,
  D,
  C extends JSX.Element
> {
  each: readonly D[] | undefined | null | false;
  wrapper: W;
  wrapperProps?: Omit<ComponentProps<W>, "children" | "ref">;
  options?: Sortable.Options;
  children(item: D, index: Accessor<number>): C;
}

const SortableComponent = <
  W extends Component<WrapperProps> | keyof JSX.IntrinsicElements,
  D,
  C extends JSX.Element
>(
  props: SortableProps<W, D, C>
): JSX.Element => {
  const [wrapperRef, setWrapperRef] = createSignal<HTMLElement | null>(null);
  const [sortable, setSortable] = createSignal<Sortable | null>(null);
  const ref = (element: HTMLElement): void => {
    setWrapperRef(() => element);
  };

  createEffect(
    on([wrapperRef, () => props.options], ([wrapperRef, options]) => {
      if (wrapperRef) {
        const currentSortable = sortable();

        if (currentSortable) {
          currentSortable.destroy();
        }

        setSortable(Sortable.create(wrapperRef, options));
      }
    })
  );

  return (
    <Dynamic {...(props.wrapperProps || {})} ref={ref} component={props.wrapper}>
      <For each={props.each}>{props.children}</For>
    </Dynamic>
  );
};

export { SortableComponent as Sortable };
