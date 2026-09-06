// Small presentational animation helpers, built on React Native's own Animated
// API so no extra dependency is needed. Everything runs on the native driver.
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Content eases up into place instead of snapping in when a screen mounts.
// Stagger a list by passing an increasing `delay`.
export function FadeIn({ children, delay = 0, offset = 16, duration = 520, style }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [offset, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// A Pressable that dips slightly under the finger. Takes the same props as
// Pressable; `style` may be a plain object/array or the usual ({ pressed })
// function.
//
// The style lands on the Pressable node itself rather than on an inner
// wrapper, so layout props like `flex: 1` and `width: "100%"` behave exactly
// as they would on a plain Pressable - and the scale transform still covers
// the element's own background and border.
export function PressableScale({ children, style, scaleTo = 0.97, disabled, ...rest }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  function animateTo(value) {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 45,
      bounciness: 0,
    }).start();
  }

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        if (disabled) return;
        setPressed(true);
        animateTo(scaleTo);
      }}
      onPressOut={() => {
        setPressed(false);
        animateTo(1);
      }}
      style={[
        typeof style === 'function' ? style({ pressed }) : style,
        { transform: [{ scale }] },
      ]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

// Slow breathing opacity, used for loading placeholders.
export function Pulse({ children, style, from = 0.45, to = 0.9, duration = 900 }) {
  const value = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: to, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(value, { toValue: from, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return <Animated.View style={[style, { opacity: value }]}>{children}</Animated.View>;
}
