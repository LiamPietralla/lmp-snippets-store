# Generic React Native Stacks

The generic stack components are useful tools when creating layouts, as we can re-use these components to apply consistent spacing and alignment to our components. In this case, we'll create a `VStack` and an `HStack` component that allows us to stack components vertically or horizontally depnding on the component used.

## Components
```tsx:line-numbers
import { StyleSheet, View, ViewStyle } from "react-native";

type VStackProps = {
  gap?: number;
  children?: React.ReactNode;
} & ViewStyle;

const VStack = ({ gap, children, ...restProps }: VStackProps) => {
  const style = vStackStyle(gap ?? 5, restProps);

  return <View style={style.vStack}>{children}</View>;
};

const vStackStyle = (gap: number, restProps: ViewStyle) =>
  StyleSheet.create({
    vStack: {
      flexDirection: "column",
      gap: gap,
      ...restProps
    },
  });
export default VStack;
```

```tsx:line-numbers
import { StyleSheet, View, ViewStyle } from "react-native";

type HStackProps = {
  gap?: number;
  children: React.ReactNode;
} & ViewStyle;

const HStack = ({ gap, children, ...restProps }: HStackProps) => {
  const style = hStackStyle(gap ?? 5, restProps);

  return <View style={style.hStack}>{children}</View>;
};

const hStackStyle = (gap: number, restProps: ViewStyle) =>
  StyleSheet.create({
    hStack: {
      flexDirection: "row",
      gap: gap,
      ...restProps
    },
  });
export default HStack;
```

## Usage

```tsx
<VStack gap={10}>
  <Text>First</Text>
  <Text>Second</Text>
  <Text>Third</Text>
</VStack>

<HStack gap={10}>
  <Text>First</Text>
  <Text>Second</Text>
  <Text>Third</Text>
</HStack>
```