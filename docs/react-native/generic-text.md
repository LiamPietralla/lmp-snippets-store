# Generic React Native Text

The generic text component is a useful tool so apply consistent styling to text components throughout your app. In this case, we'll create a `Text` component that allows us to apply consistent styling to text components.

## Component

::: code-group

```tsx:line-numbers [Text.tsx]
import { TextType } from './types';
import { ReactNode, forwardRef } from 'react';
import { Text as NativeText, TextStyle, StyleSheet, StyleProp } from 'react-native';

type TextProps = {
  type?: TextType;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
} & TextStyle;

const Text = forwardRef<NativeText, TextProps>(function Text(
  { type, children, style, ...restProps }: TextProps,
  ref
) {
  const textStyles = textStyle(type ?? 'standard', restProps);
  return (
    <NativeText ref={ref} style={[textStyles.text, style]}>
      {children}
    </NativeText>
  );
});

const textStyle = (type: TextType, restProps: TextStyle) => {
  let styles = {};

  switch (type) {
    case 'title':
      styles = {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
      };
      break;
    case 'title2':
      styles = {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
      };
      break;
    case 'subtitle':
      styles = {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'darkgray',
      };
      break;
    case 'link':
      styles = {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'blue',
        textDecorationLine: 'underline',
      };
      break;
    case 'standard':
    default:
      styles = {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'black',
      };
      break;
  }

  return StyleSheet.create({
    text: {
      ...styles,
      ...restProps,
    },
  });
};

export default Text;
```

```tsx:line-numbers [types.ts]
export type TextType = "standard" | "title" | "title2" | "subtitle" | "link";
```
:::

## Usage

```tsx
<Text type="title">Title</Text>
<Text type="subtitle">Subtitle</Text>
<Text type="link">Link</Text>
<Text>Standard</Text>
```