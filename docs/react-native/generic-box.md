# Generic React Native Box

Often in React Native, you'll want to create a generic box component that can be styled and reused throughout your app. This box in questions allows us to sourrund other components with a box that has a border, padding, and margin that we can apply. In this case they can be applied directly or via a style object.

## Component
```tsx:line-numbers [Box.tsx]
import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type BoxProps = {
  children?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>
} & ViewStyle;

const Box = ({ children, style, ...restProps }: BoxProps) => {
  const boxStyle = getBoxStyle(restProps);
  return <View style={[boxStyle.box, style]}>{children}</View>;
};

const getBoxStyle = (restProps: Omit<BoxProps, "children">) =>
  StyleSheet.create({
    box: {
      width: restProps.fullWidth ? "100%" : "auto",
      ...restProps,
    },
  });

export default Box;
```

## Usage

```tsx
<Box
  fullWidth
  style={{
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  }}
/>

<Box backgroundColor="red" borderColor="black" borderWidth={1}>
  <Text>Some text</Text>
</Box>
```