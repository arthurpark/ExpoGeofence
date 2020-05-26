import React from 'react';
import { StyleSheet } from 'react-native';
import { Box } from './Box';

export function Relative(props: any) {
  const { top, bottom, left, right, z, style, ...rest } = props;
  return (
    <Box
      style={[styles.relative, { top, bottom, left, right, zIndex: z }, style]}
      {...rest}
    />
  );
}

export function Absolute(props: any) {
  const { top, bottom, left, right, z, style, ...rest } = props;
  return (
    <Box
      style={[styles.absolute, { top, bottom, left, right, zIndex: z }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
});
