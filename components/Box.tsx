import React from 'react';
import { View } from 'react-native';
import { resolvePadding, resolveMargin } from './spacing';

export function Box(props: any) {
  const { children, padding, margin, style } = props;

  return (
    <View style={[resolvePadding(padding), resolveMargin(margin), style]}>
      {children}
    </View>
  );
}

export function Spacer(props: any) {
  const { children, width, height, flex } = props;
  return <View style={{ width, height, flex }}>{children}</View>;
}

export function Stack(props: any) {
  const { justify, alignItems, alignContent, style, ...rest } = props;
  return (
    <Box
      style={[
        {
          flexDirection: 'column',
          justifyContent: justify,
          alignItems,
          alignContent,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export function Columns(props: any) {
  const { justify, alignItems, alignContent, style, ...rest } = props;

  return (
    <Box
      style={[
        {
          flexDirection: 'row',
          justifyContent: justify,
          alignItems,
          alignContent,
        },
        style,
      ]}
      {...rest}
    />
  );
}
