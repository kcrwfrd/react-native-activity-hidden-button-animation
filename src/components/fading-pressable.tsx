import { useLayoutEffect } from "react";
import { Pressable, PressableProps, View, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  setNativeProps,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type FadingPressableProps = Omit<PressableProps, "style"> & {
  style?: ViewStyle;
  /** Opacity while pressed. Defaults to TouchableOpacity's 0.2. */
  activeOpacity?: number;
};

/**
 * A Pressable with TouchableOpacity's opacity feedback, driven by Reanimated
 * on the UI thread: snap to `activeOpacity` on press-in, fade back to 1 over
 * 250 ms with `Easing.inOut(Easing.quad)`.
 *
 * Unlike TouchableOpacity, it survives being hidden by `<Activity>` while the
 * fade-back is still in flight. See the layout effect below.
 */
export function FadingPressable({
  style,
  activeOpacity = 0.2,
  onPressIn,
  onPressOut,
  ...props
}: FadingPressableProps) {
  const ref = useAnimatedRef<View>();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  // Fail-safe for <Activity>: layout effects are cleaned up when the Activity
  // hides and re-run when it shows, so this fires at both edges. A plain
  // `opacity.set(1)` is not enough on its own: the shared value ignores a
  // same-value set and the style mapper skips unchanged output, so nothing
  // would reach the view when the value already reads 1. `setNativeProps`
  // writes straight into Reanimated's props registry and shadow tree for this
  // node, bypassing both de-duplications, and it uses the animated ref's
  // stored shadow node, so it works even while the view is not mounted.
  useLayoutEffect(() => {
    const forceOpaque = () => {
      cancelAnimation(opacity);
      opacity.set(1);
      scheduleOnUI(() => {
        "worklet";
        setNativeProps(ref, { opacity: 1 });
      });
    };
    forceOpaque();
    return forceOpaque;
  }, [opacity, ref]);

  return (
    <AnimatedPressable
      {...props}
      ref={ref}
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        opacity.set(activeOpacity);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        opacity.set(
          withTiming(1, { duration: 250, easing: Easing.inOut(Easing.quad) }),
        );
        onPressOut?.(event);
      }}
    />
  );
}
